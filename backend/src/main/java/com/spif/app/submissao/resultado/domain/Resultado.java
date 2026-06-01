package com.spif.app.submissao.resultado.domain;

import java.math.BigDecimal;

public class Resultado {
    private final long submissaoId;
    private final Long casoTesteId;
    private final String saida;
    private final Erro erro;
    private final BigDecimal tempoGasto;

    public Resultado(long submissaoId, Long casoTesteId, String saida, Erro erro, BigDecimal tempoGasto) {
        this.submissaoId = submissaoId;
        this.casoTesteId = casoTesteId;
        this.saida = saida;
        this.erro = erro;
        this.tempoGasto = tempoGasto;
    }

    public static Resultado criar(long submissaoId, String saida, Erro erro, BigDecimal tempoGasto) {
        return new Resultado(
                submissaoId,
                null,
                saida,
                erro,
                tempoGasto
        );
    }

    public Resultado atualizar(String saida, Erro erro, BigDecimal tempoGasto) {
        return new Resultado(
                this.submissaoId,
                this.casoTesteId,
                saida != null ? saida : this.saida,
                erro != null ? erro : this.erro,
                tempoGasto != null ? tempoGasto : this.tempoGasto
        );
    }

    public long getSubmissaoId() {
        return submissaoId;
    }
    public Long getCasoTesteId() {
        return casoTesteId;
    }
    public String getSaida() {
        return saida;
    }
    public Erro getErro() {
        return erro;
    }
    public BigDecimal getTempoGasto() {
        return tempoGasto;
    }
}
