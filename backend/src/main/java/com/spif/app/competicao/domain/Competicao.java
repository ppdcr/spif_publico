package com.spif.app.competicao.domain;

import java.time.OffsetDateTime;

public class Competicao {

    private final Long id;
    private final String nome;
    private final String descricao;
    private final OffsetDateTime dataInicio;
    private final OffsetDateTime dataFim;
    private boolean ativa;

    public Competicao(Long id, String nome, String descricao, OffsetDateTime dataInicio, OffsetDateTime dataFim, boolean ativa) {
        validar(nome, descricao, dataInicio, dataFim);
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.ativa = ativa;
    }

    public static Competicao criar(String nome, String descricao, OffsetDateTime dataInicio, OffsetDateTime dataFim) {
        return new Competicao(
                null,
                nome,
                descricao,
                dataInicio,
                dataFim,
                true
        );
    }

    private void validar(String nome, String descricao, OffsetDateTime dataInicio, OffsetDateTime dataFim) {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome obrigatório.");
        if (descricao == null || descricao.isBlank()) throw new IllegalArgumentException("Descrição obrigatória.");
        if (dataInicio == null || (dataFim != null && dataInicio.isAfter(dataFim))) throw new IllegalArgumentException("Data de inicio ou fim inválida.");
    }

    public Competicao atualizar(String nome, String descricao, OffsetDateTime dataInicio, OffsetDateTime dataFim, Boolean ativa) {
        return new Competicao(
                this.id,
                nome != null ? nome : this.nome,
                descricao != null ? descricao : this.descricao,
                dataInicio != null ? dataInicio : this.dataInicio,
                dataFim != null ? dataFim : this.dataFim,
                ativa != null ? ativa : this.ativa
        );
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public OffsetDateTime getDataInicio() { return dataInicio; }
    public OffsetDateTime getDataFim() { return dataFim; }
    public boolean isAtiva() { return ativa; }

}
