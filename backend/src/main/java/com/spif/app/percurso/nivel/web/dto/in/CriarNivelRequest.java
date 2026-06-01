package com.spif.app.percurso.nivel.web.dto.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CriarNivelRequest(
        @NotBlank String nome,
        @Positive int ordem,
        @NotBlank String descricao
) { }
