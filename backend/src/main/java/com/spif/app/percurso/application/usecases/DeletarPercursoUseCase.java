package com.spif.app.percurso.application.usecases;

import com.spif.app.percurso.application.ports.in.DeletarPercursoInputPort;
import com.spif.app.percurso.application.ports.out.PercursoRepository;
import com.spif.app.percurso.domain.Percurso;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarPercursoUseCase implements DeletarPercursoInputPort {

    private final PercursoRepository percursoRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public void deletar(long percursoId) {
        Percurso existente = percursoRepository.buscarPorId(percursoId)
                .orElseThrow(() -> new IllegalArgumentException("Percurso não encontrado."));

        percursoRepository.deletar(existente.getId());
    }
}
