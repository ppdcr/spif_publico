package com.spif.app.disciplina.application.usecases;

import com.spif.app.disciplina.application.ports.in.AtualizarDisciplinaInputPort;
import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.disciplina.web.dto.in.AtualizarDisciplinaRequest;
import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarDisciplinaUseCase implements AtualizarDisciplinaInputPort {

    private final DisciplinaRepository disciplinaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public DisciplinaResponse atualizar(long idDisciplina, AtualizarDisciplinaRequest request) {
        Disciplina existente = disciplinaRepository.buscarPorId(idDisciplina)
                .orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));

        Disciplina updated = existente.atualizar(request.nome(), request.ano());

        Disciplina saved = disciplinaRepository.salvar(updated);
        return DisciplinaResponse.fromDomain(saved);
    }
}
