package com.spif.app.percurso.web.dto.in;

import jakarta.validation.constraints.NotBlank;

public record CriarPercursoRequest(
        @NotBlank String nome,
        @NotBlank String descricao
) { }
