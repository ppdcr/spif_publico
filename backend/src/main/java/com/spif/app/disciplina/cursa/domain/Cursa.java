package com.spif.app.disciplina.cursa.domain;

import java.time.OffsetDateTime;

public class Cursa {
    private final long usuarioId;
    private final long disciplinaId;
    private final OffsetDateTime dataInicio;
    private final OffsetDateTime dataFim;
    private final boolean ativo;

    public Cursa(long usuarioId, long disciplinaId, OffsetDateTime dataInicio, OffsetDateTime dataFim, boolean ativo) {
        validar(dataInicio, dataFim);
        this.usuarioId = usuarioId;
        this.disciplinaId = disciplinaId;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.ativo = ativo;
    }

    private void validar(OffsetDateTime dataInicio, OffsetDateTime dataFim) {
        if (dataInicio != null && dataFim != null && dataInicio.isAfter(dataFim)) throw new IllegalArgumentException("Data de inicio e/ou fim invalida.");
    }

    public static Cursa adicionarProfessor(long usuarioId, long disciplinaId) {
        return new Cursa(usuarioId, disciplinaId, OffsetDateTime.now(), null, true);
    }

    public static Cursa convidar(long usuarioId, long disciplinaId, OffsetDateTime dataFim) {
        return new Cursa(usuarioId, disciplinaId, null, dataFim, false);
    }

    public Cursa aceitarConvite() {
        if (this.ativo) throw new IllegalStateException("Convite já aceito");
        return new Cursa(this.usuarioId, this.disciplinaId, OffsetDateTime.now(), this.dataFim, true);
    }

    public Cursa atualizar(OffsetDateTime dataInicio, OffsetDateTime dataFim, Boolean ativo) {
        return new Cursa(
                this.usuarioId,
                this.disciplinaId,
                dataInicio != null ? dataInicio : this.dataInicio,
                dataFim != null ? dataFim : this.dataFim,
                ativo != null ? ativo : this.ativo
        );
    }

    public long getUsuarioId() {
        return usuarioId;
    }
    public long getDisciplinaId() {
        return disciplinaId;
    }
    public OffsetDateTime getDataInicio() {
        return dataInicio;
    }
    public OffsetDateTime getDataFim() {
        return dataFim;
    }
    public boolean isAtivo() {
        return ativo;
    }
}