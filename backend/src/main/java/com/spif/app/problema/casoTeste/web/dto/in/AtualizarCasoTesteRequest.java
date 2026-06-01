package com.spif.app.problema.casoTeste.web.dto.in;

public record AtualizarCasoTesteRequest(
        String entrada,
        String saida,
        Boolean visivel,
        Integer ordem
) { }
