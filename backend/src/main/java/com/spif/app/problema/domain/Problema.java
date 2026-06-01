package com.spif.app.problema.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;

public class Problema {

    private final Long id;
    private final String titulo;
    private final String enunciado;
    private final String entrada;
    private final String saida;
    private final int dificuldade;
    private final BigDecimal tempoLimite;
    private final int memoriaLimiteMb;
    private final boolean visivel;
    private final long professorId;
    private final OffsetDateTime dataCriacao;
    private final List<String> assuntos;

    public Problema(Long id, String titulo, String enunciado, String entrada, String saida, int dificuldade, BigDecimal tempoLimite, int memoriaLimiteMb, boolean visivel, long professorId, OffsetDateTime dataCriacao, List<String> assuntos) {
        validar(titulo, enunciado, entrada, saida, dificuldade, tempoLimite, memoriaLimiteMb, assuntos);
        this.id = id;
        this.titulo = titulo;
        this.enunciado = enunciado;
        this.entrada = entrada;
        this.saida = saida;
        this.dificuldade = dificuldade;
        this.tempoLimite = tempoLimite;
        this.memoriaLimiteMb = memoriaLimiteMb;
        this.visivel = visivel;
        this.professorId = professorId;
        this.dataCriacao = dataCriacao;
        this.assuntos = assuntos == null ? Collections.emptyList() : List.copyOf(assuntos);
    }

    public static Problema criar(String titulo, String enunciado, String entrada, String saida, int dificuldade, BigDecimal tempoLimite, int memoriaLimiteMb, long professorId, List<String> assuntos) {
        return new Problema(
                null,
                titulo,
                enunciado,
                entrada,
                saida,
                dificuldade,
                tempoLimite,
                memoriaLimiteMb,
                true,
                professorId,
                OffsetDateTime.now(),
                assuntos
        );
    }

    private void validar(String titulo, String enunciado, String entrada, String saida, int dificuldade, BigDecimal tempoLimite, Integer memoriaLimiteMb, List<String> assuntos) {
        if (titulo == null || titulo.isBlank() || titulo.length() > 40) throw new IllegalArgumentException("Título inválido");
        if (enunciado == null || enunciado.isBlank()) throw new IllegalArgumentException("Enunciado obrigatório");
        if (entrada == null) throw new IllegalArgumentException("Entrada obrigatória");
        if (saida == null) throw new IllegalArgumentException("Saída obrigatória");
        if (dificuldade < 0 || dificuldade > 10) throw new IllegalArgumentException("Dificuldade inválida (0-10)");
        if (tempoLimite == null || tempoLimite.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Tempo limite inválido");
        if (memoriaLimiteMb != null && memoriaLimiteMb <= 0) throw new IllegalArgumentException("Memória inválida");
        if (assuntos != null) {
            for (String a : assuntos) {
                if (a == null || a.isBlank()) throw new IllegalArgumentException("Assunto inválido");
            }
        }
    }

    public Problema atualizar(String titulo, String enunciado, String entrada, String saida, Integer dificuldade, Double tempoLimite, Integer memoriaLimiteMb, Boolean visivel, List<String> assuntos) {
        return new Problema(this.id,
                titulo != null ? titulo : this.titulo,
                enunciado != null ? enunciado : this.enunciado,
                entrada != null ? entrada : this.entrada,
                saida != null ? saida : this.saida,
                dificuldade != null ? dificuldade : this.dificuldade,
                tempoLimite != null ? BigDecimal.valueOf(tempoLimite) : this.tempoLimite,
                memoriaLimiteMb != null ? memoriaLimiteMb : this.memoriaLimiteMb,
                visivel != null ? visivel : this.visivel,
                this.professorId,
                this.dataCriacao,
                assuntos != null ? assuntos : this.assuntos);
    }

    public Long getId() {
        return id;
    }
    public String getTitulo() {
        return titulo;
    }
    public String getEnunciado() {
        return enunciado;
    }
    public String getEntrada() {
        return entrada;
    }
    public String getSaida() {
        return saida;
    }
    public List<String> getAssuntos() {
        return assuntos;
    }
    public OffsetDateTime getDataCriacao() {
        return dataCriacao;
    }
    public boolean isVisivel() {
        return visivel;
    }
    public long getProfessorId() {
        return professorId;
    }
    public BigDecimal getTempoLimite() {
        return tempoLimite;
    }
    public int getMemoriaLimiteMb() {
        return memoriaLimiteMb;
    }
    public int getDificuldade() {
        return dificuldade;
    }
}