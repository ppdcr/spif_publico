package com.spif.app.lista.itemLista.infrastructure.persistence.mapper;

import com.spif.app.lista.itemLista.domain.ItemLista;
import com.spif.app.lista.itemLista.infrastructure.persistence.entity.ItemListaEntity;

public class ItemListaEntityMapper {

    public static ItemLista toDomain(ItemListaEntity e) {
        if (e == null) return null;
        return new ItemLista(e.getListaId(), e.getProblemaId());
    }

    public static ItemListaEntity toEntity(ItemLista i) {
        if (i == null) return null;
        ItemListaEntity e = new ItemListaEntity();
        e.setListaId(i.getListaId());
        e.setProblemaId(i.getProblemaId());
        return e;
    }
}
