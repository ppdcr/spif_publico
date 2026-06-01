package com.spif.app.usuario.domain;

import java.time.OffsetDateTime;

public abstract class Usuario {

    protected Long id;
    protected String prontuario;
    protected String senha;
    protected String nickname;
    protected String email;
    protected OffsetDateTime dataCriacao;
    protected Role role;

    protected Usuario(Long id, String prontuario, String senha, String nickname, String email, OffsetDateTime dataCriacao, Role role) {
        validar(id, prontuario, senha, nickname, email, dataCriacao, role);
        this.id = id;
        this.prontuario = prontuario;
        this.senha = senha;
        this.nickname = nickname;
        this.email = email;
        this.dataCriacao = dataCriacao;
        this.role = role;
    }

    private void validar(Long id, String prontuario, String senha, String nickname, String email, OffsetDateTime dataCriacao, Role role) {
        if (id != null && id < 1) { throw new IllegalArgumentException("Valor de id inválido."); }
        if (prontuario == null || prontuario.isBlank()) { throw new IllegalArgumentException("Valor de prontuario inválido."); }
        if (senha == null || senha.isBlank()) throw new IllegalArgumentException("Valor de prontuario inválido.");
        if (nickname == null || nickname.isBlank()) throw new IllegalArgumentException("Valor de nickname inválido.");
        if (email == null || email.isBlank() || !email.contains("@") || !email.contains(".")) throw new IllegalArgumentException("Valor de email inválido.");
        if (dataCriacao == null || dataCriacao.isAfter(OffsetDateTime.now())) throw new IllegalArgumentException("Valor de data de criacao inválido.");
        if (role != Role.ROLE_PROFESSOR && role != Role.ROLE_ALUNO) throw new IllegalArgumentException("Valor de role inválido.");
    }

    public abstract Usuario atualizar(String senha, String nickname, String email);

    public Long getId() { return id; }
    public String getProntuario() { return prontuario; }
    public String getSenha() { return senha; }
    public String getNickname() { return nickname; }
    public String getEmail() { return email; }
    public OffsetDateTime getDataCriacao() { return dataCriacao; }
    public Role getRole() { return role; }

}
