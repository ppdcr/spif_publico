package com.spif.app.usuario.refreshToken.infrastructure.persistence;

import com.spif.app.usuario.refreshToken.domain.RefreshToken;
import com.spif.app.usuario.refreshToken.infrastructure.persistence.entity.RefreshTokenEntity;
import com.spif.app.usuario.refreshToken.infrastructure.persistence.mapper.RefreshTokenEntityMapper;
import com.spif.app.usuario.refreshToken.infrastructure.persistence.repository.RefreshTokenJpaRepository;
import com.spif.app.usuario.refreshToken.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RefreshTokenRepositoryImpl implements RefreshTokenRepository {

    private final RefreshTokenJpaRepository repo;

    @Override
    public RefreshToken salvar(RefreshToken refreshToken) {
        RefreshTokenEntity entity = RefreshTokenEntityMapper.toEntity(refreshToken);

        RefreshTokenEntity saved = repo.save(entity);
        return RefreshTokenEntityMapper.toDomain(saved);
    }

    @Override
    public Optional<RefreshToken> buscarPorToken(String token) {
        return repo.findByToken(token).map(RefreshTokenEntityMapper::toDomain);
    }

    @Override
    public void deletarPorUsuario(long usuarioId) {
        repo.deleteByUsuarioId(usuarioId);
    }

    @Override
    public void deletarPorToken(String token) {
        repo.deleteByToken(token);
    }
}
