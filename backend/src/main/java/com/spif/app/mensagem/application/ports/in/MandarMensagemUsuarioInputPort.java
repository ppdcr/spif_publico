package com.spif.app.mensagem.application.ports.in;

import com.spif.app.mensagem.web.dto.in.MandarMensagemUsuarioRequest;
import com.spif.app.mensagem.web.dto.out.MensagemResponse;

public interface MandarMensagemUsuarioInputPort {
    MensagemResponse executar(long remetenteId, MandarMensagemUsuarioRequest request);
}
