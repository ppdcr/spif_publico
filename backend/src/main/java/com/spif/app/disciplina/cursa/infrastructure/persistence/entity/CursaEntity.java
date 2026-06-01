package com.spif.app.disciplina.cursa.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "cursa")
@Getter @Setter
@IdClass(CursaId.class)
public class CursaEntity {
    @Id
    @Column(name = "id_usuario", nullable = false)
    private long usuarioId;

    @Id
    @Column(name = "id_disciplina", nullable = false)
    private long disciplinaId;

    @Column(name = "data_inicio")
    private OffsetDateTime dataInicio;

    @Column(name = "data_fim")
    private OffsetDateTime dataFim;

    @Column(name = "ativo", nullable = false)
    private boolean ativo;
}
