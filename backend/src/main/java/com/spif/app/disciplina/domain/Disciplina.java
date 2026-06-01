package com.spif.app.disciplina.domain;

public class Disciplina {

    private final Long id;
    private final String nome;
    private final int ano;

    public Disciplina(Long id, String nome, int ano) {
        validar(nome, ano);
        this.id = id;
        this.nome = nome;
        this.ano = ano;
    }

    public static Disciplina criar(String nome, int ano) {
        return new Disciplina(
                null,
                nome,
                ano
        );
    }

    private void validar(String nome, int ano) {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Valor de nome inválido.");
        if (ano < 1) throw new IllegalArgumentException("Valor de ano inválido.");
    }

    public Disciplina atualizar(String nome, Integer ano) {
        return new Disciplina(
                this.id,
                nome != null ? nome : this.nome,
                ano != null ? ano : this.ano
        );
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public int getAno() { return ano; }
}