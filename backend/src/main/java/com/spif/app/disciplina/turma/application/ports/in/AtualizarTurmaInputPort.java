package com.spif.app.disciplina.turma.application.ports.in;

import com.spif.app.disciplina.turma.web.dto.in.AtualizarTurmaRequest;
import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;

public interface AtualizarTurmaInputPort {
    TurmaResponse atualizar(long disciplinaId, long turmaId, AtualizarTurmaRequest request);
}
