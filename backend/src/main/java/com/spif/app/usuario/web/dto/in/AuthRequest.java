package com.spif.app.usuario.web.dto.in;

import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
        @NotBlank String prontuario,
        @NotBlank String senha
) { }