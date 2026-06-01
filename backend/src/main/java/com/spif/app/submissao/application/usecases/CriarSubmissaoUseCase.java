package com.spif.app.submissao.application.usecases;

import com.spif.app.shared.security.AuthUtil;
import com.spif.app.submissao.application.ports.in.CriarSubmissaoInputPort;
import com.spif.app.submissao.application.ports.out.SubmissaoRepository;
import com.spif.app.submissao.domain.Submissao;
import com.spif.app.submissao.infrastructure.queue.MessageProducer;
import com.spif.app.submissao.web.dto.in.CriarSubmissaoRequest;
import com.spif.app.submissao.web.dto.out.SubmissaoResumoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CriarSubmissaoUseCase implements CriarSubmissaoInputPort {

    private final SubmissaoRepository submissaoRepository;
    private final MessageProducer messageProducer;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ALUNO')")
    public SubmissaoResumoResponse criar(long problemaId, CriarSubmissaoRequest request) {
        long alunoId = AuthUtil.getUsuarioId();

        Submissao created = Submissao.criar(
                request.linguagem(),
                request.codigo(),
                alunoId,
                problemaId
        );

        Submissao saved = submissaoRepository.salvar(created);

        messageProducer.enviarSubmissao(saved.getId());

        return SubmissaoResumoResponse.fromDomain(saved);
    }
}
