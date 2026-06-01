package com.spif.app.usuario.application.usecases;

import com.spif.app.usuario.application.ports.in.CriarUsuarioInputPort;
import com.spif.app.usuario.application.ports.out.TokenService;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Aluno;
import com.spif.app.usuario.domain.Professor;
import com.spif.app.usuario.domain.Role;
import com.spif.app.usuario.domain.Usuario;
import com.spif.app.usuario.web.dto.in.CriarUsuarioRequest;
import com.spif.app.usuario.web.dto.out.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CriarUsuarioUseCase implements CriarUsuarioInputPort {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Override
    @Transactional
    public AuthResponse criar(CriarUsuarioRequest request) {
        String senhaHash = passwordEncoder.encode(request.senha());

        Usuario usuario;

        if (request.role() == Role.ROLE_ALUNO) {
            usuario = Aluno.criar(request.prontuario(), senhaHash, request.nickname(), request.email());
        } else {
            usuario = Professor.criar(request.prontuario(), senhaHash, request.nickname(), request.email());
        }

        Usuario saved = usuarioRepository.salvar(usuario);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(tokenService.gerarAccessToken(saved));
        response.setRefreshToken(tokenService.gerarRefreshToken(saved.getId()));

        return response;
    }
}