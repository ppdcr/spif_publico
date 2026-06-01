package com.spif.app.lista.itemLista.application.ports.out;

import com.spif.app.lista.itemLista.domain.ItemLista;

public interface ItemListaRepository {
    ItemLista salvar(ItemLista itemLista);
    void deletar(long listaId, long problemaId);
}
