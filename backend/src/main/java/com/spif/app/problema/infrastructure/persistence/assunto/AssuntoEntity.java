package com.spif.app.problema.infrastructure.persistence.assunto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "assunto")
@Getter @Setter
@IdClass(AssuntoId.class)
public class AssuntoEntity {
    @Id
    @Column(name = "id_problema", nullable = false)
    private long problemaId;

    @Id
    @Column(name = "categoria", nullable = false)
    private String categoria;
}
