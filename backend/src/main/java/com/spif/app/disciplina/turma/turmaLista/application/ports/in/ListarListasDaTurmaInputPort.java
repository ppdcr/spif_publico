package com.spif.app.disciplina.turma.turmaLista.application.ports.in;

import com.spif.app.lista.web.dto.out.ListaProblemasResponse;

import java.util.List;

public interface ListarListasDaTurmaInputPort {
    List<ListaProblemasResponse> listarAtivasComProgresso(long disciplinaId, long turmaId);
    List<ListaProblemasResponse> listarListasInativasPorTurma(long disciplinaId, long turmaId);
}
