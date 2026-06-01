package com.spif.app.usuario.infrastructure.persistence.mapper;

import com.spif.app.usuario.domain.Aluno;
import com.spif.app.usuario.domain.Professor;
import com.spif.app.usuario.domain.Usuario;
import com.spif.app.usuario.infrastructure.persistence.entity.AlunoEntity;
import com.spif.app.usuario.infrastructure.persistence.entity.ProfessorEntity;
import com.spif.app.usuario.infrastructure.persistence.entity.UsuarioEntity;

public class UsuarioEntityMapper {
    public static Usuario toDomain(UsuarioEntity e) {
        return switch (e) {
            case null -> null;
            case AlunoEntity a ->
                    new Aluno(a.getId(), a.getProntuario(), a.getSenha(), a.getNickname(), a.getEmail(), a.getDataCriacao(), a.getPontos());
            case ProfessorEntity p ->
                    new Professor(p.getId(), p.getProntuario(), p.getSenha(), p.getNickname(), p.getEmail(), p.getDataCriacao(), p.getElogios());
            default -> throw new IllegalArgumentException("Tipo de usuário inválido.");
        };
    }

    public static UsuarioEntity toEntity(Usuario domain) {
        switch (domain) {
            case null -> {
                return null;
            }
            case Aluno d -> {
                AlunoEntity e = new AlunoEntity();
                e.setId(d.getId());
                e.setProntuario(d.getProntuario());
                e.setSenha(d.getSenha());
                e.setNickname(d.getNickname());
                e.setEmail(d.getEmail());
                e.setDataCriacao(d.getDataCriacao());
                e.setPontos(d.getPontos());
                return e;
            }
            case Professor d -> {
                ProfessorEntity e = new ProfessorEntity();
                e.setId(d.getId());
                e.setProntuario(d.getProntuario());
                e.setSenha(d.getSenha());
                e.setNickname(d.getNickname());
                e.setEmail(d.getEmail());
                e.setDataCriacao(d.getDataCriacao());
                e.setElogios(d.getElogios());
                return e;
            }
            default -> throw new IllegalArgumentException("Tipo de usuário invalido.");
        }
    }
}