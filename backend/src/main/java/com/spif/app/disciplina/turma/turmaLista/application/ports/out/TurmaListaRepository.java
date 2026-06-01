package com.spif.app.disciplina.turma.turmaLista.application.ports.out;

import com.spif.app.disciplina.turma.turmaLista.domain.TurmaLista;

import java.util.List;
import java.util.Optional;

public interface TurmaListaRepository {
    TurmaLista salvar(TurmaLista turmaLista);
    void deletar(long listaId, long turmaId);
    Optional<TurmaLista> buscarPorId(long listaId, long turmaId);
    List<TurmaLista> listarListasInativasPorTurma(long turmaId);
    boolean existe(long listaId, long turmaId);
}