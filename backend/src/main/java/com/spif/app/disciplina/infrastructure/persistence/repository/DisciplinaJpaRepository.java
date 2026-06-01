package com.spif.app.disciplina.infrastructure.persistence.repository;

import com.spif.app.disciplina.infrastructure.persistence.entity.DisciplinaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplinaJpaRepository extends JpaRepository<DisciplinaEntity, Long> {
}
