package com.spif.app.percurso.nivel.contem.domain;

public class Contem {
    private final long nivelId;
    private final long problemaId;

    public Contem(long nivelId, long problemaId) {
        this.nivelId = nivelId;
        this.problemaId = problemaId;
    }

    public static Contem criar(long nivelId, long problemaId) {
        return new Contem(
                nivelId,
                problemaId
        );
    }

    public long getNivelId() {
        return nivelId;
    }
    public long getProblemaId() {
        return problemaId;
    }
}
