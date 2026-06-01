package com.spif.app.disciplina.turma.turmaLista.application.ports.in;

import com.spif.app.disciplina.turma.turmaLista.web.dto.in.AdicionarListaATurmaRequest;
import com.spif.app.disciplina.turma.turmaLista.web.dto.out.TurmaListaResponse;

public interface AdicionarListaNaTurmaInputPort {
    TurmaListaResponse adicionar(long disciplinaId, long turmaId, AdicionarListaATurmaRequest request);
}
