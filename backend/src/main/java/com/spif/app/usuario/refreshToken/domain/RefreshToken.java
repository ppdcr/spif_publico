package com.spif.app.usuario.refreshToken.domain;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

public class RefreshToken {
    private final Long id;
    private final String token;
    private final Instant dataExpiracao;
    private final long usuarioId;

    public RefreshToken(Long id, String token, Instant dataExpiracao, long usuarioId) {
        this.id = id;
        this.token = token;
        this.dataExpiracao = dataExpiracao;
        this.usuarioId = usuarioId;
    }

    public static RefreshToken criar(long usuarioId) {
        return new RefreshToken(
                null,
                UUID.randomUUID().toString(),
                Instant.now().plus(15, ChronoUnit.DAYS),
                usuarioId);
    }

    public boolean isExpirado() {
        return dataExpiracao.isBefore(Instant.now());
    }
    public Long getId() {
        return id;
    }
    public long getUsuarioId() {
        return usuarioId;
    }
    public Instant getDataExpiracao() {
        return dataExpiracao;
    }
    public String getToken() {
        return token;
    }
}
