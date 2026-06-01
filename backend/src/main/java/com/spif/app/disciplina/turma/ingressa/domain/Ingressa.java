package com.spif.app.disciplina.turma.ingressa.domain;

import java.time.OffsetDateTime;

public class Ingressa {
    private final long turmaId;
    private final long usuarioId;
    private final OffsetDateTime dataIngresso;
    private final boolean ativo;

    public Ingressa(long turmaId, long usuarioId, OffsetDateTime dataIngresso, boolean ativo) {
        this.turmaId = turmaId;
        this.usuarioId = usuarioId;
        this.dataIngresso = dataIngresso;
        this.ativo = ativo;
    }

    public static Ingressa criar(long turmaId, long usuarioId) {
        return new Ingressa(
                turmaId,
                usuarioId,
                OffsetDateTime.now(),
                true
        );
    }

    public static Ingressa convidar(long turmaId, long usuarioId) {
        return new Ingressa(
                turmaId,
                usuarioId,
                null,
                false
        );
    }

    public Ingressa aceitarConvite() {
        if (this.ativo) throw new IllegalStateException("Convite já aceito");
        return new Ingressa(
                this.turmaId,
                this.usuarioId,
                OffsetDateTime.now(),
                true
        );
    }

    public long getTurmaId() {
        return turmaId;
    }
    public long getUsuarioId() {
        return usuarioId;
    }
    public OffsetDateTime getDataIngresso() {
        return dataIngresso;
    }
    public boolean isAtivo() {
        return ativo;
    }
}
