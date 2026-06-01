package com.spif.app.disciplina.turma.turmaLista.web.dto.in;

import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record AdicionarListaATurmaRequest(
        @NotNull long listaId,
        @NotNull OffsetDateTime dataInicio,
        OffsetDateTime dataFim
) { }