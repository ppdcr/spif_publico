package com.spif.app.problema.casoTeste.web.dto.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CriarCasoTesteRequest(
        @NotBlank String entrada,
        @NotBlank String saida,
        @NotNull boolean visivel,
        @Positive int ordem
) { }
