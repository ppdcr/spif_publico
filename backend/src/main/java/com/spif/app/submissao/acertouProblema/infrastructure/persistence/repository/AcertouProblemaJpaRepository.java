package com.spif.app.submissao.acertouProblema.infrastructure.persistence.repository;

import com.spif.app.submissao.acertouProblema.infrastructure.persistence.entity.AcertouProblemaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AcertouProblemaJpaRepository extends JpaRepository<AcertouProblemaEntity, Long> {
    boolean existsByAlunoIdAndProblemaId(long alunoId, long problemaId);
    List<AcertouProblemaEntity> findAllByAlunoId(long alunoId);
}
