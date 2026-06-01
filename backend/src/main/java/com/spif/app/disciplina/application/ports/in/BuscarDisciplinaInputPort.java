package com.spif.app.disciplina.application.ports.in;

import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;

public interface BuscarDisciplinaInputPort {
    DisciplinaResponse buscar(long disciplinaId);
}
