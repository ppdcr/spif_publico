package com.spif.app.usuario.application.ports.in;

import com.spif.app.usuario.web.dto.in.CriarUsuarioRequest;
import com.spif.app.usuario.web.dto.out.AuthResponse;


public interface CriarUsuarioInputPort {
    AuthResponse criar(CriarUsuarioRequest request);
}