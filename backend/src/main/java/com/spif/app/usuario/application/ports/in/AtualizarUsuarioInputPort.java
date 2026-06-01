package com.spif.app.usuario.application.ports.in;

import com.spif.app.usuario.web.dto.in.AtualizarUsuarioRequest;
import com.spif.app.usuario.web.dto.out.UsuarioResponse;

public interface AtualizarUsuarioInputPort {
    UsuarioResponse atualizar(AtualizarUsuarioRequest request);
}
