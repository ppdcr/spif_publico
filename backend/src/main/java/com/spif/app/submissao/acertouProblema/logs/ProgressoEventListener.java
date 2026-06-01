package com.spif.app.submissao.acertouProblema.logs;

import com.spif.app.competicao.application.ports.out.CompeticaoRepository;
import com.spif.app.competicao.domain.Competicao;
import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.percurso.nivel.application.ports.out.NivelRepository;
import com.spif.app.percurso.nivel.domain.Nivel;
import com.spif.app.submissao.acertouProblema.domain.AcertouProblema;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProgressoEventListener {

    private final NivelRepository nivelRepository;
    private final CompeticaoRepository competicaoRepository;
    private final ListaProblemasRepository listaProblemasRepository;

    private final SimpMessagingTemplate messagingTemplate;

    @Async("taskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleProblemaResolvido(AcertouProblema event) {
        verificarNiveis(event.getAlunoId(), event.getProblemaId());
        verificarListas(event.getAlunoId(), event.getProblemaId());
        verificarCompeticoes(event.getAlunoId(), event.getProblemaId());
    }

    private void verificarNiveis(long alunoId, long problemaId) {
        List<Long> concluidos = nivelRepository.buscarNiveisRecemConcluidos(alunoId, problemaId);

        for (long id : concluidos) {
            Nivel n = nivelRepository.buscarPorId(id).get();

            enviarNotificacoes(alunoId, n.getNome(), "Nível Concluído!", "Você dominou todos os problemas deste nível.");
        }
    }

    private void verificarListas(long alunoId, long problemaId) {
        List<Long> concluidas = listaProblemasRepository.buscarListasRecemConcluidas(alunoId, problemaId);

        for (long id : concluidas) {
            ListaProblemas lp = listaProblemasRepository.buscarPorId(id).get();
            enviarNotificacoes(alunoId, lp.getTitulo(), "Lista Finalizada!", "Mais uma lista de exercícios para a conta.");
        }
    }

    private void verificarCompeticoes(long alunoId, long problemaId) {
        List<Long> concluidas = competicaoRepository.buscarCompeticoesRecemConcluidas(alunoId, problemaId);

        for (long id : concluidas) {
            Competicao c = competicaoRepository.buscarPorId(id).get();
            enviarNotificacoes(alunoId, c.getNome(), "Competição Completa!", "Você resolveu todos os problemas da competição!");
        }
    }

    private void enviarNotificacoes(long alunoId, String nomeObjeto, String titulo, String mensagem) {
        String destino = "/topic/progresso/" + alunoId;
        messagingTemplate.convertAndSend(destino, Map.of(
                "titulo", titulo,
                "nomeObjeto", nomeObjeto,
                "mensagem", mensagem
        ));
    }
}