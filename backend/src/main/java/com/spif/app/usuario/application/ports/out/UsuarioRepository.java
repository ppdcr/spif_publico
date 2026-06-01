package com.spif.app.usuario.application.ports.out;

import com.spif.app.usuario.domain.Usuario;

import java.util.List;
import java.util.Optional;


public interface UsuarioRepository {
    Usuario salvar(Usuario usuario);
    Optional<Usuario> buscarPorId(long id);
    Optional<Usuario> buscarPorProntuario(String prontuario);
    Optional<Usuario> buscarPorEmail(String email);
    List<Usuario> buscarTodos();

    List<Usuario> buscarPorNome(String nome);

    List<Usuario> listarProfessoresPorElogios();
    List<Usuario> listarAlunosPorPontos();
}