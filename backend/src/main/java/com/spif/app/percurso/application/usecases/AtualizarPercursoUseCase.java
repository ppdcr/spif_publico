package com.spif.app.percurso.application.usecases;

import com.spif.app.percurso.application.ports.in.AtualizarPercursoInputPort;
import com.spif.app.percurso.application.ports.out.PercursoRepository;
import com.spif.app.percurso.domain.Percurso;
import com.spif.app.percurso.web.dto.in.AtualizarPercursoRequest;
import com.spif.app.percurso.web.dto.out.PercursoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarPercursoUseCase implements AtualizarPercursoInputPort {

    private final PercursoRepository percursoRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public PercursoResponse atualizar(long percursoId, AtualizarPercursoRequest request) {
        Percurso existente = percursoRepository.buscarPorId(percursoId)
                .orElseThrow(() -> new IllegalArgumentException("Percurso não encontrado."));

        Percurso updated = existente.atualizar(request.nome(), request.descricao());

        Percurso saved = percursoRepository.salvar(updated);
        return PercursoResponse.fromDomain(saved);
    }
}
