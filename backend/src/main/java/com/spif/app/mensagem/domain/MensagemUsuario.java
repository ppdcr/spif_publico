package com.spif.app.mensagem.domain;

import java.time.OffsetDateTime;

public class MensagemUsuario extends Mensagem {

    private final long destinatarioId;
    private final Long mensagemPaiId;
    private final String conteudoMensagemPai;
    private final OffsetDateTime horarioLida;

    public MensagemUsuario(Long id, String conteudo, OffsetDateTime horarioEnviada, long remetenteId, MensagemRole role, long destinatarioId, Long mensagemPaiId, String conteudoMensagemPai, OffsetDateTime horarioLida) {
        super(id, conteudo, horarioEnviada, remetenteId, role);
        validar(conteudoMensagemPai);
        this.destinatarioId = destinatarioId;
        this.mensagemPaiId = mensagemPaiId;
        this.conteudoMensagemPai = conteudoMensagemPai;
        this.horarioLida = horarioLida;
    }

    public static MensagemUsuario criar(String conteudo, long remetenteId, long destinatarioId) {
        return new MensagemUsuario(
                null,
                conteudo,
                OffsetDateTime.now(),
                remetenteId,
                MensagemRole.USER,
                destinatarioId,
                null,
                null,
                null
        );
    }

    public static MensagemUsuario criarResposta(String conteudo, long remetenteId, long destinatarioId, long mensagemPaiId, String conteudoMensagemPai) {
        return new MensagemUsuario(
                null,
                conteudo,
                OffsetDateTime.now(),
                remetenteId,
                MensagemRole.USER,
                destinatarioId,
                mensagemPaiId,
                conteudoMensagemPai,
                null
        );
    }

    public MensagemUsuario ler() {
        return new MensagemUsuario(
                this.getId(),
                this.getConteudo(),
                this.getHorarioEnviada(),
                this.getRemetenteId(),
                this.getRole(),
                this.destinatarioId,
                this.mensagemPaiId,
                this.conteudoMensagemPai,
                OffsetDateTime.now()
        );
    }

    private void validar(String conteudoMensagemPai) {
        if (conteudoMensagemPai != null && conteudoMensagemPai.isBlank()) throw new IllegalArgumentException("Conteudo da mensagem pai inválido.");
    }

    public long getDestinatarioId() {
        return destinatarioId;
    }
    public Long getMensagemPaiId() {
        return mensagemPaiId;
    }
    public String getConteudoMensagemPai() {
        return conteudoMensagemPai;
    }
    public OffsetDateTime getHorarioLida() {
        return horarioLida;
    }
}
