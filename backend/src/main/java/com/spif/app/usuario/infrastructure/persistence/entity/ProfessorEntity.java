package com.spif.app.usuario.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("ROLE_PROFESSOR")
@Getter
@Setter
@NoArgsConstructor
public class ProfessorEntity extends UsuarioEntity {

    @Column(name = "elogios", nullable = false)
    private int elogios;

}