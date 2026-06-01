package com.spif.app.mensagem.infrastructure.persistence.entity;

import com.spif.app.mensagem.domain.MensagemRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "mensagem")
@Getter @Setter
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "role", discriminatorType = DiscriminatorType.STRING)
public abstract class MensagemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conteudo", nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "horario_enviada", nullable = false)
    private OffsetDateTime horarioEnviada;

    @Column(name = "id_remetente", nullable = false)
    private long remetenteId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, insertable = false, updatable = false)
    private MensagemRole role;
}
