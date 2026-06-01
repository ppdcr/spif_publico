package com.spif.app.submissao.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class Submissao {
    private final Long id;
    private final Linguagem linguagem;
    private final String codigo;
    private final Status status;
    private final OffsetDateTime horaSubmissao;
    private final BigDecimal tempoExecucao;

    private final long alunoId;
    private final long problemaId;

    public Submissao(Long id, Linguagem linguagem, String codigo, Status status, OffsetDateTime horaSubmissao, BigDecimal tempoExecucao, long alunoId, long problemaId) {
        validar(linguagem, codigo, status);
        this.id = id;
        this.linguagem = linguagem;
        this.codigo = codigo;
        this.status = status;
        this.horaSubmissao = horaSubmissao;
        this.tempoExecucao = tempoExecucao;
        this.alunoId = alunoId;
        this.problemaId = problemaId;
    }

    private void validar(Linguagem linguagem, String codigo, Status status) {
        if (linguagem == null) throw new IllegalArgumentException("Linguagem inválida.");
        if (codigo == null || codigo.isBlank()) throw new IllegalArgumentException("Codigo inválido.");
        if (status == null) throw new IllegalArgumentException("Status inválido.");
    }

    public static Submissao criar(Linguagem linguagem, String codigo, long alunoId, long problemaId) {
        return new Submissao(
                null,
                linguagem,
                codigo,
                Status.PENDENTE,
                OffsetDateTime.now(),
                null,
                alunoId,
                problemaId
        );
    }

    public Submissao atualizar(Status status, BigDecimal tempoExecucao) {
        return new Submissao(
                this.id,
                this.linguagem,
                this.codigo,
                status != null ? status : this.status,
                this.horaSubmissao,
                tempoExecucao != null ? tempoExecucao : this.tempoExecucao,
                this.alunoId,
                this.problemaId
        );
    }

    public Long getId() {
        return id;
    }
    public long getProblemaId() {
        return problemaId;
    }
    public long getAlunoId() {
        return alunoId;
    }
    public BigDecimal getTempoExecucao() {
        return tempoExecucao;
    }
    public OffsetDateTime getHoraSubmissao() {
        return horaSubmissao;
    }
    public Status getStatus() {
        return status;
    }
    public String getCodigo() {
        return codigo;
    }
    public Linguagem getLinguagem() {
        return linguagem;
    }
}
