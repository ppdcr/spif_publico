package com.spif.app.percurso.nivel.contem.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "contem")
@Getter @Setter
@IdClass(ContemId.class)
public class ContemEntity {
    @Id
    @Column(name = "id_nivel", nullable = false)
    private long nivelId;

    @Id
    @Column(name = "id_problema", nullable = false)
    private long problemaId;
}
