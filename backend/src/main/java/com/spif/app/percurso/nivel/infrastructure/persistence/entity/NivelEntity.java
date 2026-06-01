package com.spif.app.percurso.nivel.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "nivel")
@Getter @Setter
@NoArgsConstructor
public class NivelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "ordem", nullable = false)
    private int ordem;

    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Column(name = "id_percurso", nullable = false)
    private long percursoId;
}
