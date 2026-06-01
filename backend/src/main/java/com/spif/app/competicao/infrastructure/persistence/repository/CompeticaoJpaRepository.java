package com.spif.app.competicao.infrastructure.persistence.repository;

import com.spif.app.competicao.infrastructure.persistence.entity.CompeticaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompeticaoJpaRepository extends JpaRepository<CompeticaoEntity, Long> {

    @Query(value = """
        SELECT p.id_competicao
        FROM participa p
        WHERE p.id_competicao IN (SELECT id_competicao FROM participa WHERE id_problema = :problemaId)
        GROUP BY p.id_competicao
        HAVING COUNT(p.id_problema) = (
            SELECT COUNT(p2.id_problema)
            FROM participa p2
            JOIN acertou_problema ap ON p2.id_problema = ap.id_problema
            WHERE p2.id_competicao = p.id_competicao AND ap.id_aluno = :alunoId
        )
    """, nativeQuery = true)
    List<Long> buscarCompeticoesRecemConcluidas(@Param("alunoId") long alunoId, @Param("problemaId") long problemaId);

    @Query(value = """
    SELECT
        c.id,
        c.nome,
        c.descricao,
        c.data_inicio AS dataInicio,
        c.data_fim AS dataFim,
        c.ativa,
        COALESCE(
            CAST(COUNT(DISTINCT ap.id_problema) AS DOUBLE PRECISION) /
            NULLIF(COUNT(DISTINCT p.id_problema), 0),
            0
        ) AS porcentagemConclusao
    FROM competicao c
    LEFT JOIN participa p ON p.id_competicao = c.id
    LEFT JOIN acertou_problema ap ON ap.id_problema = p.id_problema AND ap.id_aluno = :alunoId
    GROUP BY c.id
    """, nativeQuery = true)
    List<CompeticaoProjection> listarComProgresso(@Param("alunoId") long alunoId);

    List<CompeticaoEntity> findByAtivaFalse();
    List<CompeticaoEntity> findByAtivaTrue();
}
