package com.spif.app.lista.itemLista.domain;

public class ItemLista {
    private final long listaId;
    private final long problemaId;

    public ItemLista(long listaId, long problemaId) {
        this.listaId = listaId;
        this.problemaId = problemaId;
    }

    public static ItemLista criar(long listaId, long problemaId) {
        return new ItemLista(
                listaId,
                problemaId
        );
    }

    public long getListaId() {
        return listaId;
    }
    public long getProblemaId() {
        return problemaId;
    }
}
