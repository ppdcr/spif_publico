package com.spif.app.disciplina.turma.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "turma")
@Getter @Setter
@NoArgsConstructor
public class TurmaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "codigo_convite", nullable = false, unique = true)
    private String codigoConvite;

    @Column(name = "id_disciplina", nullable = false)
    private long disciplinaId;
}
