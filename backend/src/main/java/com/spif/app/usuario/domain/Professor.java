package com.spif.app.usuario.domain;

import java.time.OffsetDateTime;

public class Professor extends Usuario {

    private final int elogios;

    public Professor(Long id, String prontuario, String senha, String nickname, String email, OffsetDateTime dataCriacao, int elogios) {
        super(id, prontuario, senha, nickname, email, dataCriacao, Role.ROLE_PROFESSOR);
        this.elogios = elogios;
    }

    public static Professor criar(String prontuario, String senha, String nickname, String email) {
        return new Professor(
                null,
                prontuario.toLowerCase(),
                senha,
                nickname,
                email,
                OffsetDateTime.now(),
                0
        );
    }

    @Override
    public Professor atualizar(String senha, String nickname, String email) {
        return new Professor(
                this.id,
                this.prontuario,
                senha != null ? senha : this.senha,
                nickname != null ? nickname : this.nickname,
                email != null ? email : this.email,
                this.dataCriacao,
                this.elogios
        );
    }

    public Professor elogiar() {
        return new Professor(
                this.id,
                this.prontuario,
                this.senha,
                this.nickname,
                this.email,
                this.dataCriacao,
                this.elogios + 1
        );
    }

    public int getElogios() { return elogios; }
}
