package com.spif.app.lista.infrastructure.persistence.repository;

import com.spif.app.lista.infrastructure.persistence.entity.ListaProblemasEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ListaProblemasJpaRepository extends JpaRepository<ListaProblemasEntity, Long> {
    Optional<ListaProblemasEntity> findByIdAndProfessorId(long listaId, long professorId);

    @Query(value = """
        SELECT i.id_lista
        FROM item_lista i
        WHERE i.id_lista IN (SELECT id_lista FROM item_lista WHERE id_problema = :problemaId)
        GROUP BY i.id_lista
        HAVING COUNT(i.id_problema) = (
            SELECT COUNT(i2.id_problema)
            FROM item_lista i2
            JOIN acertou_problema ap ON i2.id_problema = ap.id_problema
            WHERE i2.id_lista = i.id_lista AND ap.id_aluno = :alunoId
        )
    """, nativeQuery = true)
    List<Long> buscarListasRecemConcluidas(@Param("alunoId") long alunoId, @Param("problemaId") long problemaId);

    @Query(value = """
    SELECT 
        lp.id,
        lp.id_professor AS professorId,
        lp.titulo, 
        lp.descricao,
        lp.data_criacao,
        COALESCE(
            CAST(COUNT(DISTINCT ap.id_problema) AS DOUBLE PRECISION) / 
            NULLIF(COUNT(DISTINCT il.id_problema), 0), 
            0
        ) AS porcentagemConclusao,
        lt.data_inicio AS dataInicio,
        lt.data_fim AS dataFim
    FROM lista_problemas lp
    JOIN lista_turma lt ON lt.id_lista = lp.id
    LEFT JOIN item_lista il ON il.id_lista = lp.id
    LEFT JOIN acertou_problema ap ON ap.id_problema = il.id_problema AND ap.id_aluno = :alunoId
    WHERE lt.id_turma = :turmaId AND lt.ativo = TRUE
    GROUP BY lp.id, lt.data_inicio, lt.data_fim
    """, nativeQuery = true)
    List<ListaProjection> listarAtivasComProgresso(
            @Param("turmaId") long turmaId,
            @Param("alunoId") long alunoId
    );

    List<ListaProblemasEntity> findByProfessorIdAndTituloContainingIgnoreCase(long professorId, String titulo);
    List<ListaProblemasEntity> findByProfessorId(long professorId);
}
