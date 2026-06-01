package com.spif.app.lista.itemLista.infrastructure.persistence.repository;

import com.spif.app.lista.itemLista.infrastructure.persistence.entity.ItemListaEntity;
import com.spif.app.lista.itemLista.infrastructure.persistence.entity.ItemListaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemListaJpaRepository extends JpaRepository<ItemListaEntity, ItemListaId> {
}
