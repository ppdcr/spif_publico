package com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "ingressa")
@Getter @Setter
@IdClass(IngressaId.class)
public class IngressaEntity {
    @Id
    @Column(name = "id_turma", nullable = false)
    private long turmaId;

    @Id
    @Column(name = "id_usuario", nullable = false)
    private long usuarioId;

    @Column(name = "data_ingresso")
    private OffsetDateTime dataIngresso;

    @Column(name = "ativo", nullable = false)
    private boolean ativo;
}
