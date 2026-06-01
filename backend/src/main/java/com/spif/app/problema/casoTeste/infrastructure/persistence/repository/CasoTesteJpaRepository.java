package com.spif.app.problema.casoTeste.infrastructure.persistence.repository;

import com.spif.app.problema.casoTeste.infrastructure.persistence.entity.CasoTesteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CasoTesteJpaRepository extends JpaRepository<CasoTesteEntity, Long> {
    List<CasoTesteEntity> findByProblemaIdOrderByOrdem(Long problemaId);
    List<CasoTesteEntity> findByProblemaIdAndVisivelTrueOrderByOrdem(Long problemaId);

    Optional<CasoTesteEntity> findByIdAndProblemaId(long casoId, long problemaId);
}
