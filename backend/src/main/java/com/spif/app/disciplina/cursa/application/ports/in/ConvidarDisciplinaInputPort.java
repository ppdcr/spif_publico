package com.spif.app.disciplina.cursa.application.ports.in;

import com.spif.app.disciplina.cursa.web.dto.in.MatricularCursaRequest;
import com.spif.app.disciplina.cursa.web.dto.out.CursaResponse;


public interface ConvidarDisciplinaInputPort {
    CursaResponse convidar(long disciplinaId, MatricularCursaRequest request);
}