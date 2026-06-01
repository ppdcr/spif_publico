package com.spif.app.percurso.nivel.infrastructure.persistence.repository;

import com.spif.app.percurso.nivel.infrastructure.persistence.entity.NivelEntity;
import com.spif.app.percurso.nivel.web.dto.out.NivelProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NivelJpaRepository extends JpaRepository<NivelEntity, Long> {
    @Query(value = """
        SELECT c.id_nivel
        FROM contem c
        WHERE c.id_nivel IN (SELECT id_nivel FROM contem WHERE id_problema = :problemaId)
        GROUP BY c.id_nivel
        HAVING COUNT(c.id_problema) = (
            SELECT COUNT(c2.id_problema)
            FROM contem c2
            JOIN acertou_problema ap ON c2.id_problema = ap.id_problema
            WHERE c2.id_nivel = c.id_nivel AND ap.id_aluno = :alunoId
        )
    """, nativeQuery = true)
    List<Long> buscarNiveisRecemConcluidos(@Param("alunoId") long alunoId,
                                           @Param("problemaId") long problemaId);

    @Query(value = """
    SELECT
        n.id,
        n.nome,
        n.ordem,
        n.descricao,
        COALESCE(
            CAST(COUNT(DISTINCT ap.id_problema) AS DOUBLE PRECISION) / 
            NULLIF(COUNT(DISTINCT c.id_problema), 0), 
            0
        ) AS porcentagemConclusao
    FROM nivel n
    LEFT JOIN contem c ON c.id_nivel = n.id
    LEFT JOIN acertou_problema ap ON ap.id_problema = c.id_problema AND ap.id_aluno = :alunoId
    WHERE n.id_percurso = :percursoId
    GROUP BY n.id
    ORDER BY n.ordem
    """, nativeQuery = true)
    List<NivelProjection> listarComProgresso(
            @Param("percursoId") long percursoId,
            @Param("alunoId") long alunoId
    );

    Optional<NivelEntity> findByIdAndPercursoId(long nivelId, long percursoId);
}