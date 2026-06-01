package com.spif.app.lista.application.ports.in;

import com.spif.app.lista.web.dto.in.AtualizarListaProblemasRequest;
import com.spif.app.lista.web.dto.out.ListaProblemasResponse;

public interface AtualizarListaProblemasInputPort {
    ListaProblemasResponse atualizarListaProblemas(long listaId, AtualizarListaProblemasRequest request);
}
