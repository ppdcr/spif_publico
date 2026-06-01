package com.spif.app.submissao.resultado.infrastructure.persistence.entity;

import com.spif.app.submissao.resultado.domain.Erro;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "resultado")
@Getter @Setter
@IdClass(ResultadoId.class)
public class ResultadoEntity {

    @Id
    @Column(name = "id_submissao", nullable = false)
    private long submissaoId;

    @Id
    @Column(name = "id_caso_teste", nullable = false)
    private long casoTesteId;

    @Column(name = "saida")
    private String saida;

    @Enumerated(EnumType.STRING)
    @Column(name = "erro")
    private Erro erro;

    @Column(name = "tempo_gasto")
    private BigDecimal tempoGasto;
}
