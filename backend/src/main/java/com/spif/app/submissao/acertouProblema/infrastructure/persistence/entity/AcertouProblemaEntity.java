package com.spif.app.submissao.acertouProblema.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "acertou_problema")
@Getter @Setter
@NoArgsConstructor
public class AcertouProblemaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pontos_ganhos", nullable = false)
    private int pontosGanhos;

    @Column(name = "hora_acerto", nullable = false)
    private OffsetDateTime horaAcerto;

    @Column(name = "id_aluno", nullable = false)
    private long alunoId;

    @Column(name = "id_problema", nullable = false)
    private long problemaId;
}
