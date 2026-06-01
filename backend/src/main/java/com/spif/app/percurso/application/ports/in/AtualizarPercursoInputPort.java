package com.spif.app.percurso.application.ports.in;

import com.spif.app.percurso.web.dto.in.AtualizarPercursoRequest;
import com.spif.app.percurso.web.dto.out.PercursoResponse;

public interface AtualizarPercursoInputPort {
    PercursoResponse atualizar(long percursoId, AtualizarPercursoRequest request);
}
