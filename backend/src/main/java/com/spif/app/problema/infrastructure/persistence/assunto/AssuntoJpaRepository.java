package com.spif.app.problema.infrastructure.persistence.assunto;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssuntoJpaRepository extends JpaRepository<AssuntoEntity, AssuntoId> {
    List<AssuntoEntity> findByProblemaId(long problemaId);
    void deleteByProblemaId(long problemaId);
}
