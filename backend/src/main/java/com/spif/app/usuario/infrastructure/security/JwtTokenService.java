package com.spif.app.usuario.infrastructure.security;

import com.spif.app.shared.security.UserDetailsImpl;
import com.spif.app.usuario.application.ports.out.TokenService;
import com.spif.app.usuario.domain.Usuario;
import com.spif.app.usuario.refreshToken.domain.RefreshToken;
import com.spif.app.usuario.refreshToken.repository.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenService implements TokenService {

    @Value("${app.jwtSecret}")
    private String secret;

    @Value("${app.jwtExpirationMs}")
    private long expirationMs;

    private SecretKey key;

    private final RefreshTokenRepository refreshTokenRepository;

    @PostConstruct
    public void init() {
        // Usando o charset correto para evitar problemas em diferentes SOs
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String gerarAccessToken(Usuario usuario) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(String.valueOf(usuario.getId()))
                .claim("nickname", usuario.getNickname())
                .claim("role", usuario.getRole().name())
                .claim("prontuario", usuario.getProntuario())
                .claim("email", usuario.getEmail())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    @Override
    public String gerarRefreshToken(long usuarioId) {
        RefreshToken refreshToken = RefreshToken.criar(usuarioId);

        RefreshToken saved = refreshTokenRepository.salvar(refreshToken);
        return saved.getToken();
    }

    @Override
    public boolean validarToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key) // Substitui o setSigningKey
                    .build()
                    .parseSignedClaims(token); // Substitui parseClaimsJws
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public UserDetailsImpl obterUserDetails(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Long id = Long.valueOf(claims.getSubject());
        String prontuario = claims.get("prontuario", String.class);
        String roleName = claims.get("role", String.class);

        // Convertemos a String da role para o formato que o Spring Security entende
        var authority = new SimpleGrantedAuthority(roleName);

        return new UserDetailsImpl(
                id,
                prontuario,
                null, // Senha não é necessária para tokens já validados
                List.of(authority)
        );
    }

    @Override
    public Long validarERetornarUsuarioId(String tokenStr) {
        // 1. Busca o token no banco
        return refreshTokenRepository.buscarPorToken(tokenStr)
                // 2. Filtra apenas se NÃO estiver expirado
                .filter(token -> !token.isExpirado())
                // 3. Retorna o ID do usuário atrelado
                .map(RefreshToken::getUsuarioId)
                // 4. Se não existir ou estiver expirado, explode um erro
                .orElseThrow(() -> new IllegalArgumentException("Refresh token inválido ou expirado."));
    }

    @Override
    public void revogarRefreshToken(String tokenStr) {
        // Remove o token do banco para que não possa mais ser usado para "dar refresh"
        refreshTokenRepository.deletarPorToken(tokenStr);
    }

    // Função auxiliar para obter o ID de forma simplificada no parser do JWT
    @Override
    public Long obterUsuarioIdDoToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return Long.valueOf(claims.getSubject());
    }
}
