package com.spif.app.usuario.application.usecases;

import com.spif.app.usuario.application.ports.in.BuscarUsuarioInputPort;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.web.dto.out.UsuarioResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BuscarUsuarioUseCase implements BuscarUsuarioInputPort {
    private final UsuarioRepository usuarioRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public UsuarioResponse buscarPorId(Long id) {
        return usuarioRepository.buscarPorId(id)
                .map(UsuarioResponse::fromDomain)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }
}
