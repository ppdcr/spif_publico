package com.spif.app.usuario.infrastructure.persistence.entity;

import com.spif.app.usuario.domain.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity @Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "role", discriminatorType = DiscriminatorType.STRING)
@Getter @Setter
@NoArgsConstructor
public abstract class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prontuario", nullable = false, unique = true)
    private String prontuario;

    @Column(name = "senha", nullable = false)
    private String senha;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "data_criacao")
    private OffsetDateTime dataCriacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, insertable = false, updatable = false)
    private Role role;
}