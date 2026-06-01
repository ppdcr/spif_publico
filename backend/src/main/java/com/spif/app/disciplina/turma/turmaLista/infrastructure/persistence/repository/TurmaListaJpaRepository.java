package com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence.repository;

import com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence.entity.TurmaListaEntity;
import com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence.entity.TurmaListaId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TurmaListaJpaRepository extends JpaRepository<TurmaListaEntity, TurmaListaId> {
    List<TurmaListaEntity> findByTurmaIdAndAtivoTrue(long turmaId);
    List<TurmaListaEntity> findByTurmaIdAndAtivoFalse(long turmaId);
}
