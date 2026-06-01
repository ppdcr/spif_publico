package com.spif.app.problema.infrastructure.persistence.repository;

import com.spif.app.problema.infrastructure.persistence.entity.ProblemaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProblemaJpaRepository extends JpaRepository<ProblemaEntity, Long> {
    @Query(value = """
        SELECT
            p.id, p.titulo, p.dificuldade,
            (ap.id IS NOT NULL) AS resolvido,
            STRING_AGG(DISTINCT a.categoria, ', ') AS categorias
        FROM problema p
        LEFT JOIN assunto a ON a.id_problema = p.id
        LEFT JOIN acertou_problema ap ON ap.id_problema = p.id AND ap.id_aluno = :usuarioId
        LEFT JOIN contem c ON c.id_problema = p.id
        LEFT JOIN item_lista il ON il.id_problema = p.id
        LEFT JOIN participa pa ON pa.id_problema = p.id
        WHERE p.visivel = true
        -- Adicione o cast ::tipo em todos os parâmetros que podem ser nulos
          AND (CAST(:nivelId AS bigint) IS NULL OR c.id_nivel = :nivelId)
          AND (CAST(:listaId AS bigint) IS NULL OR il.id_lista = :listaId)
          AND (CAST(:competicaoId AS bigint) IS NULL OR pa.id_competicao = :competicaoId)
          AND (CAST(:titulo AS varchar) IS NULL OR p.titulo ILIKE concat('%', :titulo, '%'))
          AND (CAST(:dificuldade AS integer) IS NULL OR p.dificuldade = :dificuldade)
        
          AND (CAST(:assuntos AS varchar) IS NULL OR p.id IN (
                SELECT a2.id_problema
                FROM assunto a2
                WHERE a2.categoria IN (:assuntos)
                GROUP BY a2.id_problema
                HAVING COUNT(DISTINCT a2.categoria) = :qtdAssuntos
          ))
        
        GROUP BY p.id, ap.id
        ORDER BY p.dificuldade
        """,
            countQuery = """
            SELECT COUNT(DISTINCT p.id) FROM problema p
            LEFT JOIN contem c ON c.id_problema = p.id
            LEFT JOIN item_lista il ON il.id_problema = p.id
            LEFT JOIN participa pa ON pa.id_problema = p.id
            WHERE p.visivel = true
              AND (:nivelId IS NULL OR c.id_nivel = :nivelId)
              AND (:listaId IS NULL OR il.id_lista = :listaId)
              AND (:competicaoId IS NULL OR pa.id_competicao = :competicaoId)
        """,
            nativeQuery = true)
    Page<ProblemaResumoProjection> buscarProblemasResumidosPaginados(
            @Param("usuarioId") long usuarioId,
            @Param("nivelId") Long nivelId,
            @Param("listaId") Long listaId,
            @Param("competicaoId") Long competicaoId,
            @Param("titulo") String titulo,
            @Param("dificuldade") Integer dificuldade,
            @Param("assuntos") List<String> assuntos,
            @Param("qtdAssuntos") Integer qtdAssuntos,
            Pageable pageable
    );

    Optional<ProblemaEntity> findByIdAndVisivelTrue(long id);
    List<ProblemaEntity> findByProfessorIdAndVisivelFalse(long professorId);
    List<ProblemaEntity> findByProfessorIdAndVisivelTrue(long professorId);
}
