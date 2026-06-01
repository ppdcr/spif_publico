package com.spif.app.percurso.nivel.application.ports.in;

import com.spif.app.percurso.nivel.web.dto.out.NivelResponse;

import java.util.List;

public interface ListarNiveisDoPercursoInputPort {
    List<NivelResponse> listarTodos(long percursoId);
}
