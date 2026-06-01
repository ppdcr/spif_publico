package com.spif.app.percurso.application.usecases;

import com.spif.app.percurso.application.ports.in.CriarPercursoInputPort;
import com.spif.app.percurso.application.ports.out.PercursoRepository;
import com.spif.app.percurso.domain.Percurso;
import com.spif.app.percurso.web.dto.in.CriarPercursoRequest;
import com.spif.app.percurso.web.dto.out.PercursoResponse;
import com.spif.app.shared.email.NotificarNovoPercurso;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CriarPercursoUseCase implements CriarPercursoInputPort {

    private final PercursoRepository percursoRepository;
    private final NotificarNovoPercurso notificarNovoPercurso;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public PercursoResponse criar(CriarPercursoRequest request) {
        Percurso percurso = Percurso.criar(request.nome(), request.descricao());

        Percurso saved = percursoRepository.salvar(percurso);

        notificarNovoPercurso.notificarGlobal(saved.getNome());
        return PercursoResponse.fromDomain(saved);
    }
}
