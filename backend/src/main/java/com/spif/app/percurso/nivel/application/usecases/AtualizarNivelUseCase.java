package com.spif.app.percurso.nivel.application.usecases;

import com.spif.app.percurso.nivel.application.ports.in.AtualizarNivelInputPort;
import com.spif.app.percurso.nivel.application.ports.out.NivelRepository;
import com.spif.app.percurso.nivel.domain.Nivel;
import com.spif.app.percurso.nivel.web.dto.in.AtualizarNivelRequest;
import com.spif.app.percurso.nivel.web.dto.out.NivelResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarNivelUseCase implements AtualizarNivelInputPort {

    private final NivelRepository nivelRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public NivelResponse atualizar(long percursoId, long nivelId, AtualizarNivelRequest request) {
        Nivel existente = nivelRepository.buscarPorIdEPercurso(percursoId, nivelId).orElseThrow(() -> new IllegalArgumentException("Nivel não encontrado neste percurso."));

        Nivel updated = existente.atualizar(request.nome(), request.ordem(), request.descricao());

        nivelRepository.salvar(updated);
        return NivelResponse.fromDomain(updated);
    }
}
