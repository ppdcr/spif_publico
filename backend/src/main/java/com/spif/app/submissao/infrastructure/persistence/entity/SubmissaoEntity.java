package com.spif.app.submissao.infrastructure.persistence.entity;

import com.spif.app.submissao.domain.Linguagem;
import com.spif.app.submissao.domain.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "submissao")
@Getter @Setter
@NoArgsConstructor
public class SubmissaoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hora_submissao", nullable = false)
    private OffsetDateTime horaSubmissao;

    @Enumerated(EnumType.STRING)
    @Column(name = "linguagem", nullable = false)
    private Linguagem linguagem;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "codigo", nullable = false)
    private String codigo;

    @Column(name = "tempo_execucao")
    private BigDecimal tempoExecucao;

    @Column(name = "id_aluno", nullable = false)
    private long alunoId;

    @Column(name = "id_problema", nullable = false)
    private long problemaId;
}
