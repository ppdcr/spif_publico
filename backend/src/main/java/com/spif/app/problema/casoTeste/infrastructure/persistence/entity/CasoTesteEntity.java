    package com.spif.app.problema.casoTeste.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "caso_teste")
@Getter @Setter
@NoArgsConstructor
public class CasoTesteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entrada", nullable = false)
    private String entrada;

    @Column(name = "saida", nullable = false)
    private String saida;

    @Column(name = "visivel", nullable = false)
    private boolean visivel;

    @Column(name = "ordem", nullable = false)
    private int ordem;

    @Column(name = "id_problema", nullable = false)
    private long problemaId;
}