package com.spif.app.usuario.web.dto.in;

import com.spif.app.usuario.domain.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CriarUsuarioRequest (
        @NotBlank String prontuario,
        @NotBlank String senha,
        @NotBlank String nickname,
        @Email String email,
        @NotNull Role role
) { }