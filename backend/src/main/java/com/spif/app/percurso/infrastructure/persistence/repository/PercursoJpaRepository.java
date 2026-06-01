package com.spif.app.percurso.infrastructure.persistence.repository;

import com.spif.app.percurso.infrastructure.persistence.entity.PercursoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PercursoJpaRepository extends JpaRepository<PercursoEntity, Long> {
    @Query(value = """
    WITH status_niveis AS (
        SELECT
            n.id_percurso,
            n.id AS nivel_id,
            CASE
                WHEN COUNT(c.id_problema) > 0 AND COUNT(c.id_problema) = COUNT(ap.id_problema) THEN 1
                ELSE 0
            END as concluido
        FROM nivel n
        LEFT JOIN contem c ON c.id_nivel = n.id
        LEFT JOIN acertou_problema ap ON ap.id_problema = c.id_problema AND ap.id_aluno = :alunoId
        GROUP BY n.id, n.id_percurso
    )
    SELECT
        p.id,
        p.nome,
        p.descricao,
        COALESCE(AVG(CAST(sn.concluido AS DOUBLE PRECISION)), 0) AS porcentagemConclusao
    FROM percurso p
    LEFT JOIN status_niveis sn ON sn.id_percurso = p.id
    GROUP BY p.id, p.nome, p.descricao
    """, nativeQuery = true)
    List<PercursoProjection> listarPercursosComProgresso(@Param("alunoId") long alunoId);
}
