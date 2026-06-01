package com.spif.app.disciplina.turma.ingressa.web.dto.in;

import jakarta.validation.constraints.Positive;

public record MatricularIngressaRequest(
    @Positive long usuarioId
) { }
