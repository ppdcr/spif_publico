package com.spif.app.disciplina.turma.domain;

import java.util.UUID;

public class Turma {

    private final Long id;
    private final String nome;
    private final String codigoConvite;
    private final long disciplinaId;

    public Turma(Long id, String nome, String codigoConvite, long disciplinaId) {
        validar(nome);
        this.id = id;
        this.nome = nome;
        this.codigoConvite = codigoConvite;
        this.disciplinaId = disciplinaId;
    }

    public static Turma criar(String nome, long disciplinaId) {
        return new Turma(
                null,
                nome,
                UUID.randomUUID().toString(),
                disciplinaId
        );
    }

    private void validar(String nome) {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome invalido.");
    }

    public Turma atualizar(String nome) {
        return new Turma(
                this.id,
                nome != null ? nome : this.nome,
                this.codigoConvite,
                this.disciplinaId
        );
    }

    public Long getId() {
        return id;
    }
    public String getNome() {
        return nome;
    }
    public String getCodigoConvite() {
        return codigoConvite;
    }
    public long getDisciplinaId() {
        return disciplinaId;
    }
}
