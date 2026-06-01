package com.spif.app.disciplina.application.ports.in;

import com.spif.app.disciplina.web.dto.in.CriarDisciplinaRequest;
import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;

public interface CriarDisciplinaInputPort {
    DisciplinaResponse criar(CriarDisciplinaRequest request);
}
