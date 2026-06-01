package com.spif.app.disciplina.turma.ingressa.application.ports.in;

import com.spif.app.disciplina.turma.ingressa.web.dto.in.MatricularIngressaRequest;
import com.spif.app.disciplina.turma.ingressa.web.dto.out.IngressaResponse;

public interface ConvidarTurmaInputPort {
    IngressaResponse convidar(long disciplinaId, long turmaId, MatricularIngressaRequest request);
}
