package com.spif.app.percurso.application.ports.in;

import com.spif.app.percurso.web.dto.in.CriarPercursoRequest;
import com.spif.app.percurso.web.dto.out.PercursoResponse;

public interface CriarPercursoInputPort {
    PercursoResponse criar(CriarPercursoRequest request);
}
