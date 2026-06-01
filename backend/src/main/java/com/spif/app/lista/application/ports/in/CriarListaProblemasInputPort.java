package com.spif.app.lista.application.ports.in;

import com.spif.app.lista.web.dto.in.CriarListaProblemasRequest;
import com.spif.app.lista.web.dto.out.ListaProblemasResponse;

public interface CriarListaProblemasInputPort {
    ListaProblemasResponse criarListaProblemas(CriarListaProblemasRequest request);
}
