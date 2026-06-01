package com.spif.app.problema.casoTeste.domain;

public class CasoTeste {

    private final Long id;
    private final long problemaId;
    private final String entrada;
    private final String saida;
    private final boolean visivel;
    private final int ordem;

    public CasoTeste(Long id, long problemaId, String entrada, String saida, boolean visivel, int ordem) {
        validar(id, problemaId, entrada, saida, ordem);
        this.id = id;
        this.problemaId = problemaId;
        this.entrada = entrada;
        this.saida = saida;
        this.visivel = visivel;
        this.ordem = ordem;
    }

    public static CasoTeste criar(long problemaId, String entrada, String saida, boolean visivel, int ordem) {
        return new CasoTeste(
                null,
                problemaId,
                entrada,
                saida,
                visivel,
                ordem
        );
    }

    private void validar(Long id, long problemaId, String entrada, String saida, int ordem) {
        if (id != null && id < 1) throw new IllegalArgumentException("Valor de id invalido.");
        if (problemaId < 1) throw new IllegalArgumentException("Valor de problemaId invalido.");
        if (entrada == null || entrada.isBlank()) throw new IllegalArgumentException("Valor de entrada invalido.");
        if (saida == null || saida.isBlank()) throw new IllegalArgumentException("Valor de saida invalido.");
        if (ordem < 1) throw new IllegalArgumentException("Valor de ordem invalido.");
    }

    public CasoTeste atualizar(String entrada, String saida, Boolean visivel, Integer ordem) {
        return new CasoTeste(this.id,
                this.problemaId,
                entrada != null ? entrada : this.entrada,
                saida != null ? saida : this.saida,
                visivel != null ? visivel : this.visivel,
                ordem != null ? ordem : this.ordem);
    }

    public Long getId() { return id; }
    public long getProblemaId() { return problemaId; }
    public String getEntrada() { return entrada; }
    public String getSaida() { return saida; }
    public boolean isVisivel() { return visivel; }
    public int getOrdem() { return ordem; }
}
