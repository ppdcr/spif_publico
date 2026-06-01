package com.spif.app.percurso.nivel.application.usecases;

import com.spif.app.percurso.nivel.application.ports.in.CriarNivelEmPercursoInputPort;
import com.spif.app.percurso.nivel.application.ports.out.NivelRepository;
import com.spif.app.percurso.nivel.domain.Nivel;
import com.spif.app.percurso.nivel.web.dto.in.CriarNivelRequest;
import com.spif.app.percurso.nivel.web.dto.out.NivelResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CriarNivelEmPercursoUseCase implements CriarNivelEmPercursoInputPort {

    private final NivelRepository nivelRepository;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public NivelResponse criar(long percursoId, CriarNivelRequest request) {
        Nivel nivel = Nivel.criar(request.nome(), request.ordem(), request.descricao(), percursoId);

        Nivel saved = nivelRepository.salvar(nivel);
        return NivelResponse.fromDomain(saved);
    }
}
