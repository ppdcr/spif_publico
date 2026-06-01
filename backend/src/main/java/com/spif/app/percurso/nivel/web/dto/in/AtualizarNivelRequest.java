package com.spif.app.percurso.nivel.web.dto.in;

public record AtualizarNivelRequest(
        String nome,
        Integer ordem,
        String descricao
) { }
