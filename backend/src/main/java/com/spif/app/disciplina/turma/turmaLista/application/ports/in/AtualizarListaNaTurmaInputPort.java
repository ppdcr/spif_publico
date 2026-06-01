package com.spif.app.disciplina.turma.turmaLista.application.ports.in;

import com.spif.app.disciplina.turma.turmaLista.web.dto.in.AtualizarListaTurmaRequest;
import com.spif.app.disciplina.turma.turmaLista.web.dto.out.TurmaListaResponse;

public interface AtualizarListaNaTurmaInputPort {
    TurmaListaResponse atualizar(long disciplinaId, long turmaId, long listaId, AtualizarListaTurmaRequest request);
}
