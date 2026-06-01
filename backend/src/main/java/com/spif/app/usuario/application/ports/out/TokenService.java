package com.spif.app.usuario.application.ports.out;

import com.spif.app.usuario.domain.Usuario;

public interface TokenService {
    String gerarAccessToken(Usuario usuario);

    String gerarRefreshToken(long usuarioId);

    boolean validarToken(String token);

    Long validarERetornarUsuarioId(String tokenStr);

    void revogarRefreshToken(String tokenStr);

    // Função auxiliar para obter o ID de forma simplificada no parser do JWT
    Long obterUsuarioIdDoToken(String token);
}