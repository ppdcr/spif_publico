package com.spif.app.competicao.web.dto.in;

import java.time.OffsetDateTime;

public record AtualizarCompeticaoRequest(
        String nome,
        String descricao,
        OffsetDateTime dataInicio,
        OffsetDateTime dataFim,
        Boolean ativa
) { }
