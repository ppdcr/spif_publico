package com.spif.app.competicao.participacao.domain;

public class Participacao {
    private final long competicaoId;
    private final long problemaId;

    public Participacao(long competicaoId, long problemaId) {
        this.competicaoId = competicaoId;
        this.problemaId = problemaId;
    }

    public static Participacao criar(long competicaoId, long problemaId) {
        return new Participacao(
                competicaoId,
                problemaId
        );
    }

    public long getCompeticaoId() {
        return competicaoId;
    }
    public long getProblemaId() {
        return problemaId;
    }
}
