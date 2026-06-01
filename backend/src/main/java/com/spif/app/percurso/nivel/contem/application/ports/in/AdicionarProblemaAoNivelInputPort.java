package com.spif.app.percurso.nivel.contem.application.ports.in;

import com.spif.app.percurso.nivel.contem.web.dto.in.AdicionarProblemaAoNivelRequest;
import com.spif.app.percurso.nivel.contem.web.dto.out.ContemResponse;

public interface AdicionarProblemaAoNivelInputPort {
    ContemResponse criar(long percursoId, long nivelId, AdicionarProblemaAoNivelRequest request);
}
