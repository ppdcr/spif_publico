package com.spif.app.disciplina.turma.application.ports.in;

import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;

public interface BuscarTurmaInputPort {
    TurmaResponse buscar(long disciplinaId, long turmaId);
}
