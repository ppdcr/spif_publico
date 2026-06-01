package com.spif.app.usuario.web.dto.in;

public record AtualizarUsuarioRequest(
        String senha,
        String nickname,
        String email
) { }
