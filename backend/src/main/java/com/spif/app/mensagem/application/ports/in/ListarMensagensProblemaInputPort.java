package com.spif.app.mensagem.application.ports.in;

import com.spif.app.mensagem.web.dto.out.MensagemResponse;

import java.util.List;

public interface ListarMensagensProblemaInputPort {
    List<MensagemResponse> buscar(long problemaId);
}
