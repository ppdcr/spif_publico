package com.spif.app.competicao.web.dto.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record CriarCompeticaoRequest(
        @NotBlank String nome,
        @NotBlank String descricao,
        @NotNull OffsetDateTime dataInicio,
        OffsetDateTime dataFim
) { }
