package com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence;

import com.spif.app.disciplina.turma.turmaLista.application.ports.out.TurmaListaRepository;
import com.spif.app.disciplina.turma.turmaLista.domain.TurmaLista;
import com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence.entity.TurmaListaEntity;
import com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence.entity.TurmaListaId;
import com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence.mapper.TurmaListaEntityMapper;
import com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence.repository.TurmaListaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TurmaListaRepositoryImpl implements TurmaListaRepository {

    private final TurmaListaJpaRepository repo;

    @Override
    public TurmaLista salvar(TurmaLista turmaLista) {
        TurmaListaEntity entity = TurmaListaEntityMapper.toEntity(turmaLista);
        TurmaListaEntity saved = repo.save(entity);
        return TurmaListaEntityMapper.toDomain(saved);
    }

    @Override
    public void deletar(long listaId, long turmaId) {
        TurmaListaId id = new TurmaListaId(listaId, turmaId);
        repo.deleteById(id);
    }

    @Override
    public Optional<TurmaLista> buscarPorId(long listaId, long turmaId) {
        TurmaListaId id = new TurmaListaId(listaId, turmaId);
        return repo.findById(id).map(TurmaListaEntityMapper::toDomain);
    }

    @Override
    public List<TurmaLista> listarListasInativasPorTurma(long turmaId) {
        return repo.findByTurmaIdAndAtivoFalse(turmaId).stream().map(TurmaListaEntityMapper::toDomain).toList();
    }


    @Override
    public boolean existe(long listaId, long turmaId) {
        TurmaListaId id = new TurmaListaId(listaId, turmaId);
        return repo.existsById(id);
    }
}
