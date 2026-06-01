package com.spif.app.mensagem.application.ports.in;

import com.spif.app.mensagem.web.dto.out.MensagemResponse;

import java.util.List;

public interface ListarMensagensUsuarioInputPort {
    List<MensagemResponse> listar(long destinatarioId);
}
