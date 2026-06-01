package com.spif.app.mensagem.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "mensagem_usuario")
@Getter @Setter
@DiscriminatorValue("USER")
public class MensagemUsuarioEntity extends MensagemEntity {
    @Column(name = "id_destinatario", nullable = false)
    private long destinatarioId;

    @Column(name = "id_mensagem_pai")
    private Long mensagemPaiId;

    @Column(name = "conteudo_mensagem_pai", columnDefinition = "TEXT")
    private String conteudoMensagemPai;

    @Column(name = "horario_lida")
    private OffsetDateTime horarioLida;
}
