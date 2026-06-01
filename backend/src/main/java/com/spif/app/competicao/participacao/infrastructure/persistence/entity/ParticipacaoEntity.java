package com.spif.app.competicao.participacao.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "participa")
@Getter @Setter
@IdClass(ParticipacaoId.class)
public class ParticipacaoEntity {
    @Id
    @Column(name = "id_competicao", nullable = false)
    private long competicaoId;

    @Id
    @Column(name = "id_problema", nullable = false)
    private long problemaId;
}
