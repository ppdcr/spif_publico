package com.spif.app.lista.itemLista.web.dto.in;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AdicionarProblemaAListaRequest(
        @NotNull long problemaId
) { }
