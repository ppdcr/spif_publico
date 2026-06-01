package com.spif.app.lista.application.ports.in;

import com.spif.app.lista.web.dto.out.ListaProblemasResponse;

import java.util.List;

public interface ListarListasProfessorInputPort {
    List<ListaProblemasResponse> listarListasProfessor(String titulo);
}
