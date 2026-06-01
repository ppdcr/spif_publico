package com.spif.app.percurso.nivel.domain;

public class Nivel {
    private final Long id;
    private final String nome;
    private final int ordem;
    private final String descricao;
    private final long percursoId;

    public Nivel(Long id, String nome, int ordem, String descricao, long percursoId) {
        validar(id, nome, ordem, descricao, percursoId);
        this.id = id;
        this.nome = nome;
        this.ordem = ordem;
        this.descricao = descricao;
        this.percursoId = percursoId;
    }

    public static Nivel criar(String nome, int ordem, String descricao, long percursoId) {
        return new Nivel(
                null,
                nome,
                ordem,
                descricao,
                percursoId
        );
    }

    private void validar(Long id, String nome, int ordem, String descricao, long percursoId) {
        if (id != null && id < 1) throw new IllegalArgumentException("Id inválido");
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome inválido");
        if (ordem < 1) throw new IllegalArgumentException("Ordem inválida");
        if (descricao == null || descricao.isBlank()) throw new IllegalArgumentException("Descricao inválida");
        if (percursoId < 1) throw new IllegalArgumentException("PercursoId inválido");
    }

    public Nivel atualizar(String nome, Integer ordem, String descricao) {
        return new Nivel(
                this.id,
                nome != null ? nome : this.nome,
                ordem != null ? ordem : this.ordem,
                descricao != null ? descricao : this.descricao,
                this.percursoId
        );
    }

    public Long getId() {
        return id;
    }
    public long getPercursoId() {
        return percursoId;
    }
    public String getDescricao() {
        return descricao;
    }
    public int getOrdem() {
        return ordem;
    }
    public String getNome() {
        return nome;
    }
}
