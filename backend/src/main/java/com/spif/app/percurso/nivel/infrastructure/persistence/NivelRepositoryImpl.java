package com.spif.app.percurso.nivel.infrastructure.persistence;

import com.spif.app.percurso.nivel.application.ports.out.NivelRepository;
import com.spif.app.percurso.nivel.domain.Nivel;
import com.spif.app.percurso.nivel.infrastructure.persistence.entity.NivelEntity;
import com.spif.app.percurso.nivel.infrastructure.persistence.mapper.NivelEntityMapper;
import com.spif.app.percurso.nivel.infrastructure.persistence.repository.NivelJpaRepository;
import com.spif.app.percurso.nivel.web.dto.out.NivelProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class NivelRepositoryImpl implements NivelRepository {

    private final NivelJpaRepository repo;

    @Override
    public Nivel salvar(Nivel nivel) {
        NivelEntity entity = NivelEntityMapper.toEntity(nivel);
        NivelEntity saved = repo.save(entity);

        return NivelEntityMapper.toDomain(saved);
    }

    @Override
    public Optional<Nivel> buscarPorIdEPercurso(long percursoId, long nivelId) {
        return repo.findByIdAndPercursoId(nivelId, percursoId).map(NivelEntityMapper::toDomain);
    }

    @Override
    public void deletar(long id) {
        repo.deleteById(id);
    }

    @Override
    public List<Long> buscarNiveisRecemConcluidos(long usuarioId, long problemaId) {
        return repo.buscarNiveisRecemConcluidos(usuarioId, problemaId).stream().toList();
    }

    @Override
    public List<NivelProjection> listarComProgresso(long percursoId, long usuarioId) {
        return repo.listarComProgresso(percursoId, usuarioId).stream().toList();
    }

    @Override
    public Optional<Nivel> buscarPorId(long nivelId) {
        return repo.findById(nivelId).map(NivelEntityMapper::toDomain);
    }
}
