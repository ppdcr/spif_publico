package com.spif.app.usuario.refreshToken.infrastructure.persistence.mapper;

import com.spif.app.usuario.refreshToken.domain.RefreshToken;
import com.spif.app.usuario.refreshToken.infrastructure.persistence.entity.RefreshTokenEntity;

public class RefreshTokenEntityMapper {

    public static RefreshToken toDomain(RefreshTokenEntity e) {
        if (e == null) return null;

        return new RefreshToken(e.getId(), e.getToken(), e.getDataExpiracao(), e.getUsuarioId());
    }

    public static RefreshTokenEntity toEntity(RefreshToken d) {
        if (d == null) return null;
        RefreshTokenEntity e = new RefreshTokenEntity();
        e.setId(d.getId());
        e.setToken(d.getToken());
        e.setDataExpiracao(d.getDataExpiracao());
        e.setUsuarioId(d.getUsuarioId());
        return e;
    }
}
