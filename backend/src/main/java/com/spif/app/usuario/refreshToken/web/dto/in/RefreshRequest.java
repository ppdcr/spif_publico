package com.spif.app.usuario.refreshToken.web.dto.in;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank String refreshToken
) { }
