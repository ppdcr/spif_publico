package com.spif.app.percurso.nivel.contem.infrastructure.persistence.repository;

import com.spif.app.percurso.nivel.contem.infrastructure.persistence.entity.ContemEntity;
import com.spif.app.percurso.nivel.contem.infrastructure.persistence.entity.ContemId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContemJpaRepository extends JpaRepository<ContemEntity, ContemId> {
}
