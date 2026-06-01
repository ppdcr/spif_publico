package com.spif.app.disciplina.infrastructure.persistence;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.disciplina.infrastructure.persistence.entity.DisciplinaEntity;
import com.spif.app.disciplina.infrastructure.persistence.mapper.DisciplinaEntityMapper;
import com.spif.app.disciplina.infrastructure.persistence.repository.DisciplinaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DisciplinaRepositoryImpl implements DisciplinaRepository {

    private final DisciplinaJpaRepository repo;

    @Override
    public Disciplina salvar(Disciplina disciplina) {
        DisciplinaEntity entity = DisciplinaEntityMapper.toEntity(disciplina);

        DisciplinaEntity saved = repo.save(entity);
        return DisciplinaEntityMapper.toDomain(saved);
    }

    @Override
    public Optional<Disciplina> buscarPorId(long idDisciplina) {
        return repo.findById(idDisciplina).map(DisciplinaEntityMapper::toDomain);
    }

    @Override
    public void deletar(long disciplinaId) {
        repo.deleteById(disciplinaId);
    }

    @Override
    public List<Disciplina> buscarTodas() {
        return repo.findAll().stream().map(DisciplinaEntityMapper::toDomain).toList();
    }
}
