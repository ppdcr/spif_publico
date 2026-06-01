package com.spif.app.lista.web.dto.in;

import jakarta.validation.constraints.NotBlank;

public record CriarListaProblemasRequest(
        @NotBlank String titulo,
        @NotBlank String descricao
) { }
