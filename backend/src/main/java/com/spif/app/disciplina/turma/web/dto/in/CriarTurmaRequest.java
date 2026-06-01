package com.spif.app.disciplina.turma.web.dto.in;

import jakarta.validation.constraints.NotBlank;

public record CriarTurmaRequest(
        @NotBlank String nome
) { }
