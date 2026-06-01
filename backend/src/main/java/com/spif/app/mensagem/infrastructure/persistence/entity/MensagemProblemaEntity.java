package com.spif.app.mensagem.infrastructure.persistence.entity;

import com.spif.app.mensagem.domain.Remetente;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "mensagem_problema")
@Getter @Setter
@DiscriminatorValue("PROBLEM")
public class MensagemProblemaEntity extends MensagemEntity {
    @Column(name = "id_problema", nullable = false)
    private long problemaId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_remetente", nullable = false)
    private Remetente remetente;
}
