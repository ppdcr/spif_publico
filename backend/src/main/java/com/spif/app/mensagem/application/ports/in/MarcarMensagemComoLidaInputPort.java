package com.spif.app.mensagem.application.ports.in;

public interface MarcarMensagemComoLidaInputPort {
    void marcar(long remetenteId, long destinatarioId);
}
