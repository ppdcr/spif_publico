package com.spif.app.submissao.acertouProblema.domain;

import java.time.OffsetDateTime;

public class AcertouProblema {
    private final Long id;
    private final int pontosGanhos;
    private final OffsetDateTime horaAcerto;

    private final long alunoId;
    private final long problemaId;

    public AcertouProblema(Long id, int pontosGanhos, OffsetDateTime horaAcerto, long alunoId, long problemaId) {
        this.id = id;
        this.pontosGanhos = pontosGanhos;
        this.horaAcerto = horaAcerto;
        this.alunoId = alunoId;
        this.problemaId = problemaId;
    }

    public static AcertouProblema criar(int pontosGanhos, long alunoId, long problemaId) {
        return new AcertouProblema(
                null,
                pontosGanhos,
                OffsetDateTime.now(),
                alunoId,
                problemaId
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
    public OffsetDateTime getHoraAcerto() {
        return horaAcerto;
    }
    public int getPontosGanhos() {
        return pontosGanhos;
    }
}
