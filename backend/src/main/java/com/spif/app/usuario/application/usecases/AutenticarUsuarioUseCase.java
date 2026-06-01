package com.spif.app.usuario.application.usecases;

import com.spif.app.usuario.application.ports.in.AutenticarUsuarioInputPort;
import com.spif.app.usuario.application.ports.out.TokenService;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Usuario;
import com.spif.app.usuario.refreshToken.web.dto.in.RefreshRequest;
import com.spif.app.usuario.web.dto.in.AuthRequest;
import com.spif.app.usuario.web.dto.out.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AutenticarUsuarioUseCase implements AutenticarUsuarioInputPort {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Override
    @Transactional
    public AuthResponse autenticar(AuthRequest request) {
        Usuario usuario = usuarioRepository.buscarPorProntuario(request.prontuario().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        return mapearAuthResponse(usuario);
    }

    @Transactional
    @Override
    public AuthResponse atualizarToken(RefreshRequest request) {
        Long usuarioId = tokenService.validarERetornarUsuarioId(request.refreshToken());

        Usuario usuario = usuarioRepository.buscarPorId(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        tokenService.revogarRefreshToken(request.refreshToken());

        return mapearAuthResponse(usuario);
    }

    private AuthResponse mapearAuthResponse(Usuario usuario) {
        AuthResponse res = new AuthResponse();
        res.setAccessToken(tokenService.gerarAccessToken(usuario));
        res.setRefreshToken(tokenService.gerarRefreshToken(usuario.getId()));
        return res;
    }
}