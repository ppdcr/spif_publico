package com.spif.app.percurso.nivel.application.ports.in;

import com.spif.app.percurso.nivel.web.dto.in.CriarNivelRequest;
import com.spif.app.percurso.nivel.web.dto.out.NivelResponse;

public interface CriarNivelEmPercursoInputPort {
    NivelResponse criar(long percursoId, CriarNivelRequest request);
}
