package com.spif.app.shared.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class AuthUtil {

    private AuthUtil() {}

    public static UserDetailsImpl getUsuarioLogado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof UserDetailsImpl user)) {
            throw new IllegalStateException("Usuário não autenticado");
        }
        return user;
    }

    public static Long getUsuarioId() {
        return getUsuarioLogado().getId();
    }

    public static String getProntuario() {
        return getUsuarioLogado().getProntuario();
    }
}