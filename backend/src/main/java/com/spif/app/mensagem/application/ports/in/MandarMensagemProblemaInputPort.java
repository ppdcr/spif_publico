package com.spif.app.mensagem.application.ports.in;

import com.spif.app.mensagem.web.dto.in.MandarMensagemProblemaRequest;
import com.spif.app.mensagem.web.dto.out.MensagemResponse;

public interface MandarMensagemProblemaInputPort {
    MensagemResponse enviarPergunta(long problemaId, MandarMensagemProblemaRequest request);
}
