package com.spif.app.disciplina.application.ports.in;

import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;

import java.util.List;

public interface ListarDisciplinasInputPort {
    List<DisciplinaResponse> listarTodas();
}
