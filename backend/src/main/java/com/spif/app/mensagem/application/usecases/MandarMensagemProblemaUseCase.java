package com.spif.app.mensagem.application.usecases;

import com.spif.app.mensagem.application.ports.in.MandarMensagemProblemaInputPort;
import com.spif.app.mensagem.application.ports.out.MensagemRepository;
import com.spif.app.mensagem.domain.Mensagem;
import com.spif.app.mensagem.domain.MensagemProblema;
import com.spif.app.mensagem.domain.Remetente;
import com.spif.app.mensagem.infrastructure.security.GroqService;
import com.spif.app.mensagem.web.dto.in.MandarMensagemProblemaRequest;
import com.spif.app.mensagem.web.dto.out.MensagemResponse;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.casoTeste.application.ports.out.CasoTesteRepository;
import com.spif.app.problema.casoTeste.domain.CasoTeste;
import com.spif.app.problema.domain.Problema;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MandarMensagemProblemaUseCase implements MandarMensagemProblemaInputPort {

    private final MensagemRepository mensagemRepository;
    private final ProblemaRepository problemaRepository;
    private final CasoTesteRepository casoRepository;
    private final GroqService groqService;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ALUNO')")
    public MensagemResponse enviarPergunta(long problemaId, MandarMensagemProblemaRequest request) {
        long alunoId = AuthUtil.getUsuarioId();

        Problema problema = problemaRepository.buscarPorId(problemaId).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado."));
        CasoTeste casoTeste = casoRepository.listarVisiveisPorProblema(problema.getId()).stream().findFirst().orElse(null);

        List<MensagemProblema> historico = mensagemRepository.buscarChatIa(alunoId, problemaId);

        String promptInicial = construirPromptInicial(request.conteudo(), problema.getEntrada(), problema.getSaida(), request.codigo(), casoTeste);

        List<Map<String, Object>> historicoFormatado = historico.stream()
                .map(m -> Map.of(
                        "role", m.getRemetente() == Remetente.USER ? "user" : "model",
                        "parts", List.of(Map.of("text", m.getConteudo()))
                )).toList();

        MensagemProblema msgUser = MensagemProblema.criarUser(request.conteudo(), alunoId, problemaId);
        mensagemRepository.salvar(msgUser);

        String respostaIA = groqService.gerarResposta(promptInicial, historicoFormatado, msgUser.getConteudo());

        // 6. Salva resposta da IA
        MensagemProblema msgIA = MensagemProblema.criarModel(respostaIA, alunoId, problemaId);
        Mensagem saved = mensagemRepository.salvar(msgIA);

        return MensagemResponse.fromDomain(saved);
    }

    private String construirPromptInicial(String prompt, String entrada, String saida, String codigo, CasoTeste casoTeste) {
        boolean perguntaSobreErros = Stream.of("erro", "bug", "não funciona", "errado", "falha", "codigo", "funciona")
                .anyMatch(k -> prompt.toLowerCase().contains(k));

        boolean temCodigo = codigo != null && !codigo.isBlank();

        // CASO 1: O aluno tem código e está reportando um erro (Debugging mode)
        if (temCodigo && perguntaSobreErros) {
            String entradaTestada = casoTeste != null ? casoTeste.getEntrada() : "Nenhum caso de teste visível cadastrado";
            String saidaEsperada = casoTeste != null ? casoTeste.getSaida() : "Nenhum caso de teste visível cadastrado";
            return """
            CONTEXTO DE DEBBUGING:
            O aluno está tentando resolver o problema cuja entrada padrão é: %s e a saída esperada é: %s
            
            Código atual do aluno:
            ```
            %s
            ```
            
            O código falha especificamente neste caso de teste:
            - Entrada testada: %s
            - Saída que deveria gerar: %s
            
            Dúvida enviada pelo aluno: "%s"
            
            INSTRUÇÃO CRÍTICA PARA A IA:
            Examine o código e localize a falha conceitual ou lógica. Não diga onde está o erro. 
            Formule uma única pergunta pontual ou aponte uma inconsistência na forma como o aluno trata a entrada especificada, forçando-o a debugar aquela variável ou condição. Responda em pouquíssimas linhas.
            """.formatted(entrada, saida, codigo, entradaTestada, saidaEsperada, prompt);
        }

        // CASO 2: O aluno tem código, mas a dúvida é geral ou técnica (Refactoring/Review mode)
        if (temCodigo) {
            return """
            CONTEXTO DE REVISÃO TÉCNICA:
            Problema com entrada padrão: %s e saída: %s
            
            Código submetido:
            ```
            %s
            ```
            
            Dúvida/Comentário do aluno: "%s"
            
            INSTRUÇÃO CRÍTICA PARA A IA:
            O aluno quer uma análise do código dele. Se houver um gargalo de performance (Complexidade O), apenas pergunte o que acontece se a entrada for muito grande, sem dar a resposta do algoritmo otimizado. 
            Dê apenas um toque sutil sobre boas práticas se necessário, de forma ultra direta. Máximo de 3 linhas.
            """.formatted(entrada, saida, codigo, prompt);
        }

        // CASO 3: O aluno ainda não tem código ou a dúvida é puramente teórica (Conceptual mode)
        return """
        CONTEXTO CONCEITUAL:
        O aluno está analisando o problema com entrada: %s e saída: %s
        
        Dúvida Geral do Aluno: "%s"
        
        INSTRUÇÃO CRÍTICA PARA A IA:
        O aluno está perdido na teoria ou na interpretação. Indique apenas o nome da estrutura de dados ou a estratégia algorítmica genérica aplicável (ex: "Busca Binária", "Two Pointers", "Fila de Prioridade"). 
        Instigue-o a pesquisar como esse conceito se encaixa no mapeamento da entrada para a saída. Não explique o funcionamento do algoritmo de forma extensa.
        """.formatted(entrada, saida, prompt);
    }
}
