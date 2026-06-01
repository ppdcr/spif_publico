package com.spif.app.disciplina.turma.turmaLista.web.dto.in;

import java.time.OffsetDateTime;

public record AtualizarListaTurmaRequest(
        OffsetDateTime dataInicio,
        OffsetDateTime dataFim,
        Boolean ativo
) { }
