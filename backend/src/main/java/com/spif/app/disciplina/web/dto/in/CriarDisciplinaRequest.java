package com.spif.app.disciplina.web.dto.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CriarDisciplinaRequest(
        @NotBlank String nome,
        @Positive int ano
) { }
