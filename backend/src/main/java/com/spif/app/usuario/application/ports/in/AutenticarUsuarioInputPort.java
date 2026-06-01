package com.spif.app.usuario.application.ports.in;

import com.spif.app.usuario.refreshToken.web.dto.in.RefreshRequest;
import com.spif.app.usuario.web.dto.in.AuthRequest;
import com.spif.app.usuario.web.dto.out.AuthResponse;

public interface AutenticarUsuarioInputPort {
    AuthResponse autenticar(AuthRequest request);
    AuthResponse atualizarToken(RefreshRequest request);
}
