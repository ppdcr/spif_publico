package com.spif.app.percurso.infrastructure.persistence;

import com.spif.app.percurso.application.ports.out.PercursoRepository;
import com.spif.app.percurso.domain.Percurso;
import com.spif.app.percurso.infrastructure.persistence.entity.PercursoEntity;
import com.spif.app.percurso.infrastructure.persistence.mapper.PercursoEntityMapper;
import com.spif.app.percurso.infrastructure.persistence.repository.PercursoJpaRepository;
import com.spif.app.percurso.infrastructure.persistence.repository.PercursoProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PercursoRepositoryImpl implements PercursoRepository {

    private final PercursoJpaRepository repo;

    @Override
    public Percurso salvar(Percurso percurso) {
        PercursoEntity entity = PercursoEntityMapper.toEntity(percurso);

        PercursoEntity saved = repo.save(entity);
        return PercursoEntityMapper.toDomain(saved);
    }

    @Override
    public Optional<Percurso> buscarPorId(long percursoId) {
        return repo.findById(percursoId).map(PercursoEntityMapper::toDomain);
    }

    @Override
    public void deletar(long percursoId) {
        repo.deleteById(percursoId);
    }

    @Override
    public List<PercursoProjection> listarPercursosComProgresso(long alunoId) {
        return repo.listarPercursosComProgresso(alunoId);
    }
}
