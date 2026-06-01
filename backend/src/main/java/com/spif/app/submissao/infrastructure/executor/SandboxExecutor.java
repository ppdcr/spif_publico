package com.spif.app.submissao.infrastructure.executor;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.async.ResultCallback;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.model.Frame;
import com.github.dockerjava.api.model.StreamType;
import com.spif.app.submissao.domain.Linguagem;
import com.spif.app.submissao.resultado.domain.Erro;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class SandboxExecutor {

    private final DockerClient dockerClient;
    private final ContainerPool containerPool;

    public record ExecResult(
            String stdout,
            String stderr,
            long exitCode,
            boolean timeout,
            boolean memoryExceeded,
            BigDecimal tempo
    ) {
        public Erro avaliarErro(String saidaEsperada) {
            if (timeout)         return Erro.TIME_LIMIT_EXCEEDED;
            if (memoryExceeded)  return Erro.MEMORY_LIMIT_EXCEEDED;
            if (exitCode != 0)   return Erro.RUNTIME_ERROR;
            if (!normalizar(stdout).equals(normalizar(saidaEsperada))) return Erro.WRONG_ANSWER;
            return null;
        }

        private static String normalizar(String s) {
            if (s == null) return "";
            return Arrays.stream(s.split("\n"))
                    .map(String::strip)
                    .filter(l -> !l.isEmpty())
                    .collect(Collectors.joining("\n"));
        }
    }

    public record CompilationResult(boolean sucesso, String erro) {}

    public String adquirirContainer(Linguagem lang, String codigo, int memoriaLimiteMb) {
        String containerId = containerPool.adquirir(lang, memoriaLimiteMb);
        copiarCodigo(containerId, lang, codigo);
        return containerId;
    }

    public void liberarContainer(String containerId, Linguagem lang) {
        containerPool.devolver(containerId, lang);
    }

    private ExecResult executarComoRoot(String containerId, String comando) {
        StringBuilder stdout = new StringBuilder();
        StringBuilder stderr = new StringBuilder();

        try {
            var exec = dockerClient.execCreateCmd(containerId)
                    .withAttachStdout(true).withAttachStderr(true)
                    .withUser("root")
                    .withCmd("sh", "-c", comando)
                    .exec();

            dockerClient.execStartCmd(exec.getId())
                    .exec(new ResultCallback.Adapter<>() {
                        @Override public void onNext(Frame f) {
                            if (f == null || f.getPayload() == null) return;
                            String text = new String(f.getPayload());
                            if (f.getStreamType() == StreamType.STDERR) stderr.append(text);
                            else stdout.append(text);
                        }
                    })
                    .awaitCompletion(10, TimeUnit.SECONDS);

            Long code = dockerClient.inspectExecCmd(exec.getId()).exec().getExitCodeLong();
            long exitCode = code != null ? code : -1;
            return new ExecResult(limpar(stdout.toString()), limpar(stderr.toString()),
                    exitCode, false, false, BigDecimal.ZERO);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new ExecResult("", "", -1, true, false, BigDecimal.ZERO);
        }
    }

    public CompilationResult compilar(String containerId, Linguagem lang) {
        String comando = switch (lang) {
            case JAVA -> "javac /app/Main.java -d /app && chmod -R 755 /app/*.class";
            case C    -> "gcc /app/main.c -O2 -o /app/main && chmod 755 /app/main";
            case CPP  -> "g++ /app/main.cpp -O2 -std=c++17 -o /app/main && chmod 755 /app/main";
            default   -> null;
        };
        if (comando == null) return new CompilationResult(true, null);

        // compilação roda como root para garantir permissões corretas no binário
        ExecResult res = executarComoRoot(containerId, comando);
        if (res.timeout() || res.exitCode() != 0) {
            String erro = !res.stderr().isBlank() ? res.stderr() : res.stdout();
            return new CompilationResult(false, erro);
        }

        return new CompilationResult(true, null);
    }

    public ExecResult executar(String containerId, String entrada,
                               BigDecimal tempoLimite, Linguagem lang, String comando) {
        StringBuilder stdout = new StringBuilder();
        StringBuilder stderr = new StringBuilder();
        BigDecimal tempoAjustado = ajustarTempoLimite(tempoLimite, lang);
        long timeoutMs = tempoAjustado.multiply(BigDecimal.valueOf(1000)).longValue();

        String entradaEscapada = (entrada == null ? "" : entrada).replace("'", "'\\''");
        String comandoFinal = entradaEscapada.isEmpty()
                ? comando
                : "printf '%s\\n' '" + entradaEscapada + "' | " + comando;

        long start = System.currentTimeMillis();
        long exitCode = -1;
        boolean timeout = false;


        try {
            var exec = dockerClient.execCreateCmd(containerId)
                    .withAttachStdout(true).withAttachStderr(true)
                    .withUser("nobody")
                    .withCmd("sh", "-c", comandoFinal)
                    .exec();

            boolean terminou = dockerClient.execStartCmd(exec.getId())
                    .exec(new ResultCallback.Adapter<>() {
                        @Override public void onNext(Frame f) {
                            if (f == null || f.getPayload() == null) return;
                            String text = new String(f.getPayload());
                            if (f.getStreamType() == StreamType.STDERR) stderr.append(text);
                            else stdout.append(text);
                        }
                    })
                    .awaitCompletion(timeoutMs, TimeUnit.MILLISECONDS);

            timeout = !terminou;
            Long code = dockerClient.inspectExecCmd(exec.getId()).exec().getExitCodeLong();
            exitCode = code != null ? code : -1;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            timeout = true;
        }

        long elapsed = System.currentTimeMillis() - start;
        String out = limpar(stdout.toString());
        String err = limpar(stderr.toString());

        return new ExecResult(
                out, err, exitCode,
                timeout,
                exitCode == 137,   // SIGKILL = OOM
                BigDecimal.valueOf(elapsed / 1000.0)
        );
    }

    private String limpar(String s) {
        return s == null ? "" : s.replace("\r\n", "\n").trim();
    }

    private void copiarCodigo(String containerId, Linguagem lang, String codigo) {
        String nomeArquivo = switch (lang) {
            case JAVA -> "Main.java"; case C -> "main.c"; case CPP -> "main.cpp";
            case PYTHON -> "solution.py"; case JAVASCRIPT -> "solution.js";
        };

        // Codifica em base64 para evitar problemas com aspas, newlines e
        // caracteres especiais no shell
        String base64 = Base64.getEncoder().encodeToString(
                codigo.getBytes(StandardCharsets.UTF_8)
        );

        // printf é mais portável que echo -n; base64 -d funciona em todas as imagens
        String cmd = String.format(
                "printf '%%s' '%s' | base64 -d > /app/%s",
                base64, nomeArquivo
        );

        try {
            ExecCreateCmdResponse exec = dockerClient.execCreateCmd(containerId)
                    .withAttachStderr(true)
                    .withUser("root")
                    .withCmd("sh", "-c", cmd)
                    .exec();

            dockerClient.execStartCmd(exec.getId())
                    .exec(new ResultCallback.Adapter<>())
                    .awaitCompletion(5, TimeUnit.SECONDS);

            Long exitCode = dockerClient.inspectExecCmd(exec.getId()).exec().getExitCodeLong();
            if (exitCode != null && exitCode != 0) {
                throw new RuntimeException("Falha ao escrever arquivo no container, exit code: " + exitCode);
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrompido ao copiar código", e);
        }
    }

    private BigDecimal ajustarTempoLimite(BigDecimal tempoLimite, Linguagem lang) {
        double fator = switch (lang) {
            case C, CPP        -> 1.0;
            case JAVA, JAVASCRIPT          -> 2.0;
            case PYTHON        -> 3.0;
        };
        return tempoLimite.multiply(BigDecimal.valueOf(fator));
    }
}
