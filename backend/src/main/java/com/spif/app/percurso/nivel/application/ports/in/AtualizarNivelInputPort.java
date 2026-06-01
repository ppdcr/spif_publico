package com.spif.app.percurso.nivel.application.ports.in;

import com.spif.app.percurso.nivel.web.dto.in.AtualizarNivelRequest;
import com.spif.app.percurso.nivel.web.dto.out.NivelResponse;

public interface AtualizarNivelInputPort {
    NivelResponse atualizar(long percursoId, long nivelId, AtualizarNivelRequest request);
}
