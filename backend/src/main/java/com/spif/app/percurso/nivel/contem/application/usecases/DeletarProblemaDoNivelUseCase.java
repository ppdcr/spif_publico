package com.spif.app.percurso.nivel.contem.application.usecases;

import com.spif.app.percurso.nivel.application.ports.out.NivelRepository;
import com.spif.app.percurso.nivel.contem.application.ports.in.DeletarProblemaDoNivelInputPort;
import com.spif.app.percurso.nivel.contem.application.ports.out.ContemRepository;
import com.spif.app.percurso.nivel.domain.Nivel;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.domain.Problema;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarProblemaDoNivelUseCase implements DeletarProblemaDoNivelInputPort {

    private final ContemRepository contemRepository;
    private final NivelRepository nivelRepository;
    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public void deletar(long percursoId, long nivelId, long problemaId) {
        Nivel n = nivelRepository.buscarPorIdEPercurso(percursoId, nivelId).orElseThrow(() -> new IllegalArgumentException("Nivel não encontrado neste percurso."));
        Problema p = problemaRepository.buscarPorId(problemaId).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado."));

        contemRepository.deletar(n.getId(), p.getId());
    }
}
