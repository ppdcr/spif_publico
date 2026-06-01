package com.spif.app.usuario.application.ports.in;

import com.spif.app.usuario.web.dto.out.UsuarioResponse;


public interface BuscarUsuarioInputPort {
    UsuarioResponse buscarPorId(Long id);
}