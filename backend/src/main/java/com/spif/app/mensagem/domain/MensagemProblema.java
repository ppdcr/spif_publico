package com.spif.app.mensagem.domain;

import java.time.OffsetDateTime;

public class MensagemProblema extends Mensagem {

    private final long problemaId;
    private final Remetente remetente;

    public MensagemProblema(Long id, String conteudo, OffsetDateTime horarioEnviada, long remetenteId, MensagemRole role, long problemaId, Remetente remetente) {
        super(id, conteudo, horarioEnviada, remetenteId, role);
        this.problemaId = problemaId;
        this.remetente = remetente;
    }

    public static MensagemProblema criarUser(String conteudo, long remetenteId, long problemaId) {
        return new MensagemProblema(
                null,
                conteudo,
                OffsetDateTime.now(),
                remetenteId,
                MensagemRole.PROBLEM,
                problemaId,
                Remetente.USER
        );
    }

    public static MensagemProblema criarModel(String conteudo, long remetenteId, long problemaId) {
        return new MensagemProblema(
                null,
                conteudo,
                OffsetDateTime.now(),
                remetenteId,
                MensagemRole.PROBLEM,
                problemaId,
                Remetente.MODEL
        );
    }

    public long getProblemaId() {
        return problemaId;
    }
    public Remetente getRemetente() {
        return remetente;
    }
}
