package com.spif.app.percurso.nivel.contem.web.dto.in;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AdicionarProblemaAoNivelRequest(
        @NotNull List<Long> problemaIds
) { }
