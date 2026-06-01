package com.spif.app.disciplina.turma.turmaLista.application.ports.in;

public interface DeletarListaDaTurmaInputPort {
    void deletar(long disciplinaId, long turmaId, long listaId);
}
