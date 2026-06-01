package com.spif.app.disciplina.turma.infrastructure.persistence.repository;

import com.spif.app.disciplina.turma.infrastructure.persistence.entity.TurmaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TurmaJpaRepository extends JpaRepository<TurmaEntity, Long> {
    Optional<TurmaEntity> findByIdAndDisciplinaId(long turmaId, long disciplinaId);
    Optional<TurmaEntity> findByDisciplinaIdAndCodigoConvite(long disciplinaId, String codigoConvite);

    @Query(value = """
    WITH status_listas AS (
        SELECT 
            lt.id_turma,
            lp.id AS lista_id,
            CASE 
                WHEN COUNT(il.id_problema) = 0 THEN 0
                WHEN COUNT(DISTINCT il.id_problema) = COUNT(DISTINCT ap.id_problema) THEN 1
                ELSE 0 
            END as concluida
        FROM lista_problemas lp
        JOIN lista_turma lt ON lt.id_lista = lp.id
        LEFT JOIN item_lista il ON il.id_lista = lp.id
        LEFT JOIN acertou_problema ap ON ap.id_problema = il.id_problema AND ap.id_aluno = :alunoId
        WHERE lt.ativo = TRUE
        GROUP BY lp.id, lt.id_turma
    )
    SELECT 
        t.id, 
        t.nome,
        t.codigo_convite,
        COALESCE(AVG(CAST(sl.concluida AS DOUBLE PRECISION)), 0) AS porcentagemConclusao
    FROM turma t
    INNER JOIN ingressa i ON i.id_turma = t.id 
    LEFT JOIN status_listas sl ON sl.id_turma = t.id
    WHERE t.id_disciplina = :disciplinaId
      AND i.id_usuario = :alunoId 
      AND i.ativo = TRUE
    GROUP BY t.id, t.nome, t.codigo_convite
    """, nativeQuery = true)
    List<TurmaProjection> listarTurmasAtivasComProgresso(
            @Param("disciplinaId") long disciplinaId,
            @Param("alunoId") long alunoId
    );
}
