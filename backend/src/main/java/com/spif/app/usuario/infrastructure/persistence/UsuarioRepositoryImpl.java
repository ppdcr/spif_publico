package com.spif.app.usuario.infrastructure.persistence;

import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Usuario;
import com.spif.app.usuario.infrastructure.persistence.entity.UsuarioEntity;
import com.spif.app.usuario.infrastructure.persistence.mapper.UsuarioEntityMapper;
import com.spif.app.usuario.infrastructure.persistence.repository.UsuarioJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UsuarioRepositoryImpl implements UsuarioRepository {

    private final UsuarioJpaRepository repo;

    @Override
    public Usuario salvar(Usuario usuario) {
        UsuarioEntity entity = UsuarioEntityMapper.toEntity(usuario);

        UsuarioEntity saved = repo.save(entity);

        return UsuarioEntityMapper.toDomain(saved);
    }


    @Override
    public Optional<Usuario> buscarPorId(long id) {
        return repo.findById(id).map(UsuarioEntityMapper::toDomain);
    }


    @Override
    public Optional<Usuario> buscarPorProntuario(String prontuario) {
        return repo.findByProntuario(prontuario).map(UsuarioEntityMapper::toDomain);
    }


    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return repo.findByEmail(email).map(UsuarioEntityMapper::toDomain);
    }

    @Override
    public List<Usuario> buscarTodos() {
        return repo.findAll().stream().map(UsuarioEntityMapper::toDomain).toList();
    }

    @Override
    public List<Usuario> buscarPorNome(String nome) {
        return repo.findByNicknameContainingIgnoreCase(nome).stream().map(UsuarioEntityMapper::toDomain).toList();
    }

    @Override
    public List<Usuario> listarProfessoresPorElogios() {
        return repo
                .findAllProfessoresOrderByElogiosDesc()
                .stream()
                .map(UsuarioEntityMapper::toDomain)
                .toList();
    }

    @Override
    public List<Usuario> listarAlunosPorPontos() {
        return repo
                .findAllAlunosOrderByPontosDesc()
                .stream()
                .map(UsuarioEntityMapper::toDomain)
                .toList();
    }
}