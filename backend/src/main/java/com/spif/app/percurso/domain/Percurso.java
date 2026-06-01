package com.spif.app.percurso.domain;

public class Percurso {
    private final Long id;
    private final String nome;
    private final String descricao;

    public Percurso(Long id, String nome, String descricao) {
        validar(nome, descricao);
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    public static Percurso criar(String nome, String descricao) {
        return new Percurso(
                null,
                nome,
                descricao
        );
    }

    private void validar(String nome, String descricao) {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome obrigatório.");
        if (descricao == null || descricao.isBlank()) throw new IllegalArgumentException("Descrição obrigatória.");
    }

    public Percurso atualizar(String nome, String descricao) {
        return new Percurso(
                this.id,
                nome != null ? nome : this.nome,
                descricao != null ? descricao : this.descricao
        );
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
}
