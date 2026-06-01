package com.spif.app.usuario.web.dto.out;

import com.spif.app.usuario.domain.Aluno;
import com.spif.app.usuario.domain.Professor;
import com.spif.app.usuario.domain.Role;
import com.spif.app.usuario.domain.Usuario;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class UsuarioResponse {
    private long id;
    private String prontuario;
    private String nickname;
    private String email;
    private Role role;
    private OffsetDateTime dataCriacao;
    private Integer pontos;
    private Integer elogios;


    public static UsuarioResponse fromDomain(Usuario u) {
        if (u == null) return null;
        UsuarioResponse r = new UsuarioResponse();
        r.setId(u.getId());
        r.setProntuario(u.getProntuario());
        r.setNickname(u.getNickname());
        r.setEmail(u.getEmail());
        r.setRole(u.getRole());
        r.setDataCriacao(u.getDataCriacao());
        if (u instanceof Aluno) r.setPontos(((Aluno) u).getPontos());
        if (u instanceof Professor) r.setElogios(((Professor) u).getElogios());
        return r;
    }
}