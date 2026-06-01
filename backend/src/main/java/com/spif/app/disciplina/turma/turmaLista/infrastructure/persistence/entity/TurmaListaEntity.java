package com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "lista_turma")
@Getter @Setter
@IdClass(TurmaListaId.class)
public class TurmaListaEntity {

    @Id
    @Column(name = "id_lista", nullable = false)
    private long listaId;

    @Id
    @Column(name = "id_turma", nullable = false)
    private long turmaId;

    @Column(name = "data_inicio", nullable = false)
    private OffsetDateTime dataInicio;

    @Column(name = "data_fim")
    private OffsetDateTime dataFim;

    @Column(name = "ativo", nullable = false)
    private boolean ativo;
}
