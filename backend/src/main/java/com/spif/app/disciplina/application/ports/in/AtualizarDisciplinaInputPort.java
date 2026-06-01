package com.spif.app.disciplina.application.ports.in;

import com.spif.app.disciplina.web.dto.in.AtualizarDisciplinaRequest;
import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;

public interface AtualizarDisciplinaInputPort {
    DisciplinaResponse atualizar(long disciplinaId, AtualizarDisciplinaRequest request);
}
