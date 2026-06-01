package com.spif.app.problema.web.dto.in;

import java.util.List;

public record AtualizarProblemaRequest(
        String titulo,
        String enunciado,
        String entrada,
        String saida,
        Integer dificuldade,
        Double tempoLimite,
        Integer memoriaLimiteMb,
        Boolean visivel,
        List<String> assuntos
) { }
