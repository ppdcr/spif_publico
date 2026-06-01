package com.spif.app.competicao.participacao.web.dto.in;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AdicionarProblemaEmCompeticaoRequest(
        @NotNull List<Long> problemaIds
) { }
