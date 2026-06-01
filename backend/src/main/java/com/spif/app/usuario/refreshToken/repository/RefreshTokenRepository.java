package com.spif.app.usuario.refreshToken.repository;

import com.spif.app.usuario.refreshToken.domain.RefreshToken;

import java.util.Optional;

public interface RefreshTokenRepository {
    RefreshToken salvar(RefreshToken refreshToken);
    Optional<RefreshToken> buscarPorToken(String token);
    void deletarPorUsuario(long usuarioId);
    void deletarPorToken(String token);
}
