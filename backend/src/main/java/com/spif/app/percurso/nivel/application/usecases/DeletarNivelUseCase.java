package com.spif.app.percurso.nivel.application.usecases;

import com.spif.app.percurso.nivel.application.ports.in.DeletarNivelInputPort;
import com.spif.app.percurso.nivel.application.ports.out.NivelRepository;
import com.spif.app.percurso.nivel.domain.Nivel;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarNivelUseCase implements DeletarNivelInputPort {

    private final NivelRepository nivelRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public void deletar(long percursoId, long nivelId) {
        Nivel existente = nivelRepository.buscarPorIdEPercurso(percursoId, nivelId).orElseThrow(() -> new IllegalArgumentException("Nivel não encontrado neste percurso."));

        nivelRepository.deletar(existente.getId());
    }
}
