package com.spif.app.lista.itemLista.application.ports.in;

import com.spif.app.lista.itemLista.web.dto.in.AdicionarProblemaAListaRequest;

public interface AdicionarProblemaAListaInputPort {
    void criar(long listaId, AdicionarProblemaAListaRequest request);
}
