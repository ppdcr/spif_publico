package com.spif.app.disciplina.turma.infrastructure.persistence;

import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.infrastructure.persistence.entity.TurmaEntity;
import com.spif.app.disciplina.turma.infrastructure.persistence.mapper.TurmaEntityMapper;
import com.spif.app.disciplina.turma.infrastructure.persistence.repository.TurmaJpaRepository;
import com.spif.app.disciplina.turma.infrastructure.persistence.repository.TurmaProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TurmaRepositoryImpl implements TurmaRepository {

    private final TurmaJpaRepository repo;

    @Override
    public Turma salvar(Turma turma) {
        TurmaEntity entity = TurmaEntityMapper.toEntity(turma);

        TurmaEntity saved = repo.save(entity);
        return TurmaEntityMapper.toDomain(saved);
    }

    @Override
    public void deletar(long turmaId) {
        repo.deleteById(turmaId);
    }

    @Override
    public Optional<Turma> buscarPorId(long disciplinaId, long turmaId) {
        return repo.findByIdAndDisciplinaId(turmaId, disciplinaId).map(TurmaEntityMapper::toDomain);
    }

    @Override
    public List<TurmaProjection> listarTurmasAtivasComProgresso(long disciplinaId, long usuarioId) {
        return repo.listarTurmasAtivasComProgresso(disciplinaId, usuarioId);
    }

    @Override
    public Optional<Turma> buscarPorDisciplinaIdECodigoConvite(long disciplinaId, String codigoConvite) {
        return repo.findByDisciplinaIdAndCodigoConvite(disciplinaId, codigoConvite).map(TurmaEntityMapper::toDomain);
    }
}
