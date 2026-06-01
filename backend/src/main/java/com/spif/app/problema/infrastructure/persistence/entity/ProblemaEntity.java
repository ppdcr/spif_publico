package com.spif.app.problema.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "problema")
@Getter @Setter
@NoArgsConstructor
public class ProblemaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "enunciado", nullable = false)
    private String enunciado;

    @Column(name = "entrada", nullable = false)
    private String entrada;

    @Column(name = "saida", nullable = false)
    private String saida;

    @Column(name = "dificuldade", nullable = false)
    private Short dificuldade;

    @Column(name = "tempo_limite", nullable = false, precision = 6, scale = 3)
    private BigDecimal tempoLimite;

    @Column(name = "memoria_limite_mb", nullable = false)
    private Integer memoriaLimiteMb;

    @Column(name = "visivel", nullable = false)
    private boolean visivel;

    @Column(name = "id_professor", nullable = false)
    private long professorId;

    @Column(name = "data_criacao")
    private OffsetDateTime dataCriacao;
}