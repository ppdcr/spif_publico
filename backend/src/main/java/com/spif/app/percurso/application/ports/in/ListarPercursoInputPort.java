package com.spif.app.percurso.application.ports.in;

import com.spif.app.percurso.web.dto.out.PercursoResponse;

import java.util.List;

public interface ListarPercursoInputPort {
    List<PercursoResponse> listarTodos();
}
