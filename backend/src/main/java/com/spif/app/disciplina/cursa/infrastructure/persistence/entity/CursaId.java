package com.spif.app.disciplina.cursa.infrastructure.persistence.entity;

import lombok.*;

import java.io.Serializable;

@Getter @Setter
@NoArgsConstructor // O segredo para o JPA não inverter os valores
@AllArgsConstructor
@EqualsAndHashCode
public class CursaId implements Serializable {
    private long usuarioId;
    private long disciplinaId;
}
