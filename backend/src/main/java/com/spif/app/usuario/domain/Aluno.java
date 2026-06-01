package com.spif.app.usuario.domain;

import java.time.OffsetDateTime;

public class Aluno extends Usuario {

    private int pontos;

    public Aluno(Long id, String prontuario, String senha, String nickname, String email, OffsetDateTime dataCriacao, int pontos) {
        super(id, prontuario, senha, nickname, email, dataCriacao, Role.ROLE_ALUNO);
        this.pontos = pontos;
    }

    public static Aluno criar(String prontuario, String senha, String nickname, String email) {
        return new Aluno(
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
    public Aluno atualizar(String senha, String nickname, String email) {
        return new Aluno(
                this.id,
                this.prontuario,
                senha != null ? senha : this.senha,
                nickname != null ? nickname : this.nickname,
                email != null ? email : this.email,
                this.dataCriacao,
                this.pontos
        );
    }

    public void acertouProblema(int pontosGanhos) {
        this.pontos += pontosGanhos;
    }

    public int getPontos() { return pontos; }
}
