package com.spif.app.lista.domain;

import java.time.OffsetDateTime;

public class ListaProblemas {
    private final Long id;
    private final long professorId;
    private final String titulo;
    private final String descricao;
    private final OffsetDateTime dataCriacao;

    public ListaProblemas(Long id, long professorId, String titulo, String descricao, OffsetDateTime dataCriacao) {
        validar(titulo, descricao);
        this.id = id;
        this.professorId = professorId;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataCriacao = dataCriacao;
    }

    public static ListaProblemas criar(long professorId, String titulo, String descricao) {
        return new ListaProblemas(
                null,
                professorId,
                titulo,
                descricao,
                OffsetDateTime.now()
        );
    }

    private void validar(String titulo, String descricao) {
        if (titulo == null || titulo.isBlank()) throw new IllegalArgumentException("Titulo inválido.");
        if (descricao == null || descricao.isBlank()) throw new IllegalArgumentException("Descrição inválida.");
    }

    public ListaProblemas atualizar(String titulo, String descricao) {
        return new ListaProblemas(
                this.id,
                this.professorId,
                titulo != null ? titulo : this.titulo,
                descricao != null ? descricao : this.descricao,
                this.dataCriacao
        );
    }

    public Long getId() {
        return id;
    }
    public long getProfessorId() {
        return professorId;
    }
    public String getTitulo() {
        return titulo;
    }
    public String getDescricao() {
        return descricao;
    }
    public OffsetDateTime getDataCriacao() {
        return dataCriacao;
    }
}
