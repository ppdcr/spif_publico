package com.spif.app.mensagem.domain;

import java.time.OffsetDateTime;

public abstract class Mensagem {

    private final Long id;
    private final String conteudo;
    private final OffsetDateTime horarioEnviada;
    private final long remetenteId;
    private final MensagemRole role;

    public Mensagem(Long id, String conteudo, OffsetDateTime horarioEnviada, long remetenteId, MensagemRole role) {
        validar(conteudo);
        this.id = id;
        this.conteudo = conteudo;
        this.horarioEnviada = horarioEnviada;
        this.remetenteId = remetenteId;
        this.role = role;
    }

    private void validar(String conteudo) {
        if (conteudo == null || conteudo.isBlank()) throw new IllegalArgumentException("Conteudo inválido.");
    }

    public Long getId() {
        return id;
    }
    public MensagemRole getRole() {
        return role;
    }
    public long getRemetenteId() {
        return remetenteId;
    }
    public OffsetDateTime getHorarioEnviada() {
        return horarioEnviada;
    }
    public String getConteudo() {
        return conteudo;
    }
}
