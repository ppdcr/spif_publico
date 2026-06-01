package com.spif.app.usuario.application.ports.in;

import com.spif.app.usuario.web.dto.out.UsuarioResumoResponse;

import java.util.List;

public interface ListarUsuariosInputPort {
    List<UsuarioResumoResponse> listarPorNome(String nome);
}
