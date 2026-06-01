package com.spif.app.mensagem.web.dto.in;

import jakarta.validation.constraints.NotBlank;

public record MandarMensagemProblemaRequest(
        @NotBlank String conteudo,
        String codigo
) { }
