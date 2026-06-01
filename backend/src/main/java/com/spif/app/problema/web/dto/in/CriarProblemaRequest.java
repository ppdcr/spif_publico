package com.spif.app.problema.web.dto.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record CriarProblemaRequest(
        @NotBlank String titulo,
        @NotBlank String enunciado,
        @NotBlank String entrada,
        @NotBlank String saida,
        @Positive int dificuldade,
        @Positive double tempoLimite,
        @NotNull int memoriaLimiteMb,
        @NotNull List<String> assuntos
) { }
