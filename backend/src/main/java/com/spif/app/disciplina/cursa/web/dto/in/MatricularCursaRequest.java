package com.spif.app.disciplina.cursa.web.dto.in;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Positive;

import java.time.OffsetDateTime;

public record MatricularCursaRequest(
        @Positive long usuarioId,
        @Future OffsetDateTime dataFim
) { }
