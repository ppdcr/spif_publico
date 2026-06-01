package com.spif.app.submissao.resultado.infrastructure.persistence.repository;

import com.spif.app.submissao.resultado.infrastructure.persistence.entity.ResultadoEntity;
import com.spif.app.submissao.resultado.infrastructure.persistence.entity.ResultadoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultadoJpaRepository extends JpaRepository<ResultadoEntity, ResultadoId> {
    List<ResultadoEntity> findBySubmissaoId(long submissaoId);
}
