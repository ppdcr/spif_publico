package com.spif.app.usuario.application.usecases;

import com.spif.app.shared.security.AuthUtil;
import com.spif.app.usuario.application.ports.in.AtualizarUsuarioInputPort;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Usuario;
import com.spif.app.usuario.web.dto.in.AtualizarUsuarioRequest;
import com.spif.app.usuario.web.dto.out.UsuarioResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarUsuarioUseCase implements AtualizarUsuarioInputPort {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public UsuarioResponse atualizar(AtualizarUsuarioRequest request) {
        Long id = AuthUtil.getUsuarioId();

        Usuario existente = usuarioRepository.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (request.email() != null && !request.email().equals(existente.getEmail())) {
            usuarioRepository.buscarPorEmail(request.email()).ifPresent(other -> {
                if (!other.getId().equals(id)) {
                    throw new IllegalArgumentException("E-mail já está em uso");
                }
            });
        }

        String novaSenha = null;
        if (request.senha() != null && !request.senha().isBlank() && !request.senha().equals(existente.getSenha())) {
            novaSenha = passwordEncoder.encode(request.senha());
        }

        Usuario updated = existente.atualizar(novaSenha, request.nickname(), request.email());

        Usuario salvo = usuarioRepository.salvar(updated);
        return UsuarioResponse.fromDomain(salvo);
    }
}
