package com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.entity;

import lombok.*;

import java.io.Serializable;

@Getter @Setter
@NoArgsConstructor // O segredo para o JPA não inverter os valores
@AllArgsConstructor
@EqualsAndHashCode
public class IngressaId implements Serializable {
    private long turmaId;
    private long usuarioId;
}
