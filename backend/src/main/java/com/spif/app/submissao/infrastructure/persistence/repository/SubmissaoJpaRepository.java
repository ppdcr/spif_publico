package com.spif.app.submissao.infrastructure.persistence.repository;

import com.spif.app.submissao.infrastructure.persistence.entity.SubmissaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissaoJpaRepository extends JpaRepository<SubmissaoEntity, Long> {
    List<SubmissaoEntity> findByProblemaIdAndAlunoId(long problemaId, long alunoId);
}
