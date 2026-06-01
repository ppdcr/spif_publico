package com.spif.app.disciplina.turma.application.ports.in;

import com.spif.app.disciplina.turma.web.dto.in.CriarTurmaRequest;
import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;

public interface CriarTurmaInputPort {
    TurmaResponse criar(long disciplinaId, CriarTurmaRequest request);
}
