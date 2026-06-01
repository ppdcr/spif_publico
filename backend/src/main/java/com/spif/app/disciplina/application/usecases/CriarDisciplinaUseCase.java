package com.spif.app.disciplina.application.usecases;

import com.spif.app.disciplina.application.ports.in.CriarDisciplinaInputPort;
import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.disciplina.web.dto.in.CriarDisciplinaRequest;
import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CriarDisciplinaUseCase implements CriarDisciplinaInputPort {

    private final DisciplinaRepository disciplinaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public DisciplinaResponse criar(CriarDisciplinaRequest request) {
        Disciplina disciplina = Disciplina.criar(request.nome(), request.ano());

        Disciplina saved = disciplinaRepository.salvar(disciplina);
        return DisciplinaResponse.fromDomain(saved);
    }
}
