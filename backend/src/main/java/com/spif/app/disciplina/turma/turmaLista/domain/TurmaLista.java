package com.spif.app.disciplina.turma.turmaLista.domain;

import java.time.OffsetDateTime;

public class TurmaLista {
    private final long listaId;
    private final long turmaId;
    private final OffsetDateTime dataInicio;
    private final OffsetDateTime dataFim;
    private final boolean ativo;

    public TurmaLista(long listaId, long turmaId, OffsetDateTime dataInicio, OffsetDateTime dataFim, boolean ativo) {
        validar(dataInicio, dataFim);
        this.listaId = listaId;
        this.turmaId = turmaId;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.ativo = ativo;
    }

    public static TurmaLista criar(long listaId, long turmaId, OffsetDateTime dataInicio, OffsetDateTime dataFim) {
        return new TurmaLista(
                listaId,
                turmaId,
                dataInicio,
                dataFim,
                true
        );
    }

    public TurmaLista atualizar(OffsetDateTime dataInicio, OffsetDateTime dataFim, Boolean ativo) {
        return new TurmaLista(
                this.listaId,
                this.turmaId,
                dataInicio != null ? dataInicio : this.dataInicio,
                dataFim != null ? dataFim : this.dataFim,
                ativo != null ? ativo : this.ativo
        );
    }

    private void validar(OffsetDateTime dataInicio, OffsetDateTime dataFim) {
        if (dataInicio == null || (dataFim != null && dataInicio.isAfter(dataFim))) throw new IllegalArgumentException("Data de inicio ou fim inválida.");
    }

    public long getListaId() {
        return listaId;
    }
    public long getTurmaId() {
        return turmaId;
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
