package com.spif.app.mensagem.web.dto.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MandarMensagemUsuarioRequest(
        @NotNull long destinatarioId,
        @NotBlank String conteudo,
        Long mensagemPaiId
) {
}
