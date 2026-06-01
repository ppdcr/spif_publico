package com.spif.app.submissao.infrastructure.executor;

import com.spif.app.submissao.acertouProblema.domain.AcertouProblema;
import com.spif.app.submissao.acertouProblema.repository.AcertouProblemaRepository;
import com.spif.app.submissao.application.ports.out.SubmissaoRepository;
import com.spif.app.submissao.domain.Status;
import com.spif.app.submissao.domain.Submissao;
import com.spif.app.submissao.resultado.domain.Resultado;
import com.spif.app.submissao.web.dto.out.SubmissaoResponse;
import com.spif.app.problema.domain.Problema;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Aluno;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinalizarSubmissao {

    private final SubmissaoRepository submissaoRepository;
    private final AcertouProblemaRepository acertouProblemaRepository;
    private final UsuarioRepository usuarioRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void finalizar(Submissao sub, Problema problema, List<Resultado> resultados) {
        boolean algumErro = resultados.stream().anyMatch(r -> r.getErro() != null);
        Status status = algumErro ? Status.REJEITADO : Status.ACEITO;

        if (status == Status.ACEITO
                && !acertouProblemaRepository.acertouProblema(sub.getAlunoId(), problema.getId())) {
            Aluno aluno = (Aluno) usuarioRepository.buscarPorId(sub.getAlunoId()).get();
            aluno.acertouProblema(problema.getDificuldade());
            usuarioRepository.salvar(aluno);

            AcertouProblema acertou = AcertouProblema.criar(
                    problema.getDificuldade(), sub.getAlunoId(), problema.getId()
            );
            acertouProblemaRepository.salvar(acertou);
            eventPublisher.publishEvent(acertou);
        }

        double tempoMax = resultados.stream()
                .mapToDouble(r -> r.getTempoGasto().doubleValue())
                .max().orElse(0.0);

        sub = sub.atualizar(status, BigDecimal.valueOf(tempoMax));
        submissaoRepository.salvar(sub);

        SubmissaoResponse payload = SubmissaoResponse.fromDomain(sub);
        payload.setResultados(resultados);
        messagingTemplate.convertAndSend("/topic/submissoes/" + sub.getAlunoId(), payload);
    }
}