package com.spif.app.lista.application.ports.in;

import com.spif.app.lista.web.dto.out.ListaProblemasResponse;

public interface BuscarListaInputPort {
    ListaProblemasResponse buscar(long listaId, Long turmaId);
}
