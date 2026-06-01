package com.spif.app.lista.itemLista.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "item_lista")
@Getter @Setter
@IdClass(ItemListaId.class)
public class ItemListaEntity {
    @Id
    @Column(name = "id_lista", nullable = false)
    private long listaId;

    @Id
    @Column(name = "id_problema", nullable = false)
    private long problemaId;
}
