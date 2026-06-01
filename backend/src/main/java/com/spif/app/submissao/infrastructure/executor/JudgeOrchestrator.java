package com.spif.app.submissao.infrastructure.executor;

import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.casoTeste.application.ports.out.CasoTesteRepository;
import com.spif.app.problema.casoTeste.domain.CasoTeste;
import com.spif.app.problema.domain.Problema;
import com.spif.app.submissao.acertouProblema.domain.AcertouProblema;
import com.spif.app.submissao.acertouProblema.repository.AcertouProblemaRepository;
import com.spif.app.submissao.application.ports.out.SubmissaoRepository;
import com.spif.app.submissao.domain.Linguagem;
import com.spif.app.submissao.domain.Status;
import com.spif.app.submissao.domain.Submissao;
import com.spif.app.submissao.infrastructure.queue.config.RabbitMqConfig;
import com.spif.app.submissao.resultado.domain.Erro;
import com.spif.app.submissao.resultado.domain.Resultado;
import com.spif.app.submissao.resultado.repository.ResultadoRepository;
import com.spif.app.submissao.web.dto.out.SubmissaoResponse;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Aluno;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class JudgeOrchestrator {

    private final SandboxExecutor sandbox;
    private final SubmissaoRepository submissaoRepository;
    private final CasoTesteRepository casoTesteRepository;
    private final ProblemaRepository problemaRepository;
    private final ResultadoRepository resultadoRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final FinalizarSubmissao finalizarSubmissao;

    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME)
    public void processarSubmissao(long submissaoId) {
        Submissao sub = submissaoRepository.buscarPorId(submissaoId)
                .orElseThrow(() -> new RuntimeException("Submissão não encontrada: " + submissaoId));

        List<CasoTeste> casos = casoTesteRepository.listarPorProblemaOrdenado(sub.getProblemaId());
        Problema problema = problemaRepository.buscarPorId(sub.getProblemaId())
                .orElseThrow(() -> new RuntimeException("Problema não encontrado"));

        if (casos.isEmpty()) {
            finalizarSubmissao.finalizar(sub, problema, List.of());
            return;
        }

        sub = sub.atualizar(Status.PROCESSANDO, null);
        submissaoRepository.salvar(sub);

        String containerId = null;
        try {
            containerId = sandbox.adquirirContainer(
                    sub.getLinguagem(), sub.getCodigo(), problema.getMemoriaLimiteMb()
            );

            var compilacao = sandbox.compilar(containerId, sub.getLinguagem());
            if (!compilacao.sucesso()) {
                notificarErroCompilacao(sub, compilacao.erro());
                return;
            }

            String cmdExec = getComandoExecucao(sub.getLinguagem());
            List<Resultado> resultados = new ArrayList<>();

            for (CasoTeste caso : casos) {
                var exec = sandbox.executar(
                        containerId, caso.getEntrada(), problema.getTempoLimite(), sub.getLinguagem(), cmdExec
                );

                Erro erro = exec.avaliarErro(caso.getSaida());

                Resultado resultado = new Resultado(
                        sub.getId(), caso.getId(), exec.stdout(), erro, exec.tempo()
                );
                resultados.add(resultado);
                resultadoRepository.salvar(resultado);

                if (erro != null) break; // fail-fast
            }

            finalizarSubmissao.finalizar(sub, problema, resultados);

        } catch (Exception e) {
            log.error("Erro no judge para submissão {}", submissaoId, e);
            sub = sub.atualizar(Status.REJEITADO, BigDecimal.ZERO);
            submissaoRepository.salvar(sub);
            notificar(sub, List.of());
        } finally {
            if (containerId != null) {
                sandbox.liberarContainer(containerId, sub.getLinguagem());
            }
        }
    }

    private void notificar(Submissao sub, List<Resultado> resultados) {
        SubmissaoResponse payload = SubmissaoResponse.fromDomain(sub);
        payload.setResultados(resultados);
        messagingTemplate.convertAndSend("/topic/submissoes/" + sub.getAlunoId(), payload);
    }

    private void notificarErroCompilacao(Submissao sub, String erro) {
        sub = sub.atualizar(Status.COMPILATION_ERROR, BigDecimal.ZERO);
        submissaoRepository.salvar(sub);
        SubmissaoResponse payload = SubmissaoResponse.fromDomain(sub);
        payload.setResultados(List.of());
        messagingTemplate.convertAndSend(
                "/topic/submissoes/" + sub.getAlunoId(),
                Map.of("submissao", payload, "erro", erro)
        );
    }

    private String getComandoExecucao(Linguagem lang) {
        return switch (lang) {
            case JAVA       -> "java -Xms32m -Xmx256m -cp /app Main";
            case C, CPP -> "/app/main";
            case PYTHON     -> "python3 /app/solution.py";
            case JAVASCRIPT -> "node --max-old-space-size=256 /app/solution.js";
        };
    }
}