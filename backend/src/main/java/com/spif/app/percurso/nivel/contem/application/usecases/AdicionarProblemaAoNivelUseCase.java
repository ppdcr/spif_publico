package com.spif.app.percurso.nivel.contem.application.usecases;

import com.spif.app.percurso.nivel.application.ports.out.NivelRepository;
import com.spif.app.percurso.nivel.contem.application.ports.in.AdicionarProblemaAoNivelInputPort;
import com.spif.app.percurso.nivel.contem.application.ports.out.ContemRepository;
import com.spif.app.percurso.nivel.contem.domain.Contem;
import com.spif.app.percurso.nivel.contem.web.dto.in.AdicionarProblemaAoNivelRequest;
import com.spif.app.percurso.nivel.contem.web.dto.out.ContemResponse;
import com.spif.app.percurso.nivel.domain.Nivel;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.domain.Problema;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdicionarProblemaAoNivelUseCase implements AdicionarProblemaAoNivelInputPort {

    private final ContemRepository contemRepository;
    private final NivelRepository nivelRepository;
    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public ContemResponse criar(long percursoId, long nivelId, AdicionarProblemaAoNivelRequest request) {
        Nivel n = nivelRepository.buscarPorIdEPercurso(percursoId, nivelId).orElseThrow(() -> new IllegalArgumentException("Nivel não encontrado neste percurso."));

        List<Long> saved = new ArrayList<>();
        for (long id: request.problemaIds()) {
            Problema p = problemaRepository.buscarPorId(id).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado."));
            Contem c = Contem.criar(n.getId(), p.getId());
            contemRepository.salvar(c);
            saved.add(c.getProblemaId());
        }

        return ContemResponse.fromList(saved);
    }
}
