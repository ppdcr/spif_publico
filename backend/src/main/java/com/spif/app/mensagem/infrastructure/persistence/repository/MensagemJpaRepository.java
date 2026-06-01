package com.spif.app.mensagem.infrastructure.persistence.repository;

import com.spif.app.mensagem.infrastructure.persistence.entity.MensagemEntity;
import com.spif.app.mensagem.infrastructure.persistence.entity.MensagemProblemaEntity;
import com.spif.app.mensagem.infrastructure.persistence.entity.MensagemUsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MensagemJpaRepository extends JpaRepository<MensagemEntity, Long> {
    @Query("SELECT m FROM MensagemProblemaEntity m " +
            "WHERE m.remetenteId = :alunoId " +
            "AND m.problemaId = :problemaId " +
            "ORDER BY m.horarioEnviada ASC")
    List<MensagemProblemaEntity> findChatIa(
            @Param("alunoId") long alunoId,
            @Param("problemaId") long problemaId
    );

    @Query("SELECT m FROM MensagemUsuarioEntity m " +
            "WHERE m.remetenteId = :remetenteId " +
            "AND m.destinatarioId = :destinatarioId " +
            "AND m.horarioLida IS NULL")
    List<MensagemUsuarioEntity> findNaoLidas(
            @Param("remetenteId") long remetenteId,
            @Param("destinatarioId") long destinatarioId
    );

    @Query("SELECT m FROM MensagemUsuarioEntity m " +
            "WHERE (m.remetenteId = :usuarioId AND m.destinatarioId = :contatoId) " +
            "   OR (m.remetenteId = :contatoId AND m.destinatarioId = :usuarioId) " +
            "ORDER BY m.horarioEnviada ASC")
    List<MensagemUsuarioEntity> findConversa(
            @Param("usuarioId") long usuarioId,
            @Param("contatoId") long contatoId
    );

    @Query(value = """
    WITH UltimasMensagens AS (
        SELECT
            mu.id,
            m.conteudo AS ultima_mensagem,
            m.horario_enviada,
            mu.horario_lida,
            m.id_remetente AS remetente_id,
            CASE
                WHEN m.id_remetente = :usuarioId THEN mu.id_destinatario
                ELSE m.id_remetente
            END AS contato_id,
            ROW_NUMBER() OVER(
                PARTITION BY CASE
                    WHEN m.id_remetente = :usuarioId THEN mu.id_destinatario
                    ELSE m.id_remetente
                END
                ORDER BY m.horario_enviada DESC
            ) as rn
        FROM mensagem_usuario mu
        JOIN mensagem m ON m.id = mu.id
        WHERE m.id_remetente = :usuarioId OR mu.id_destinatario = :usuarioId
    )
    SELECT
        um.contato_id AS id,
        u.nickname,
        um.ultima_mensagem AS ultimaMensagem,
        um.horario_enviada AS horarioEnviada,
        um.horario_lida AS horarioLida,
        CAST(CASE WHEN um.remetente_id = :usuarioId THEN 1 ELSE 0 END AS BOOLEAN) AS enviadaPorVoce,
        (
            SELECT COUNT(mu2.id)
            FROM mensagem_usuario mu2
            JOIN mensagem m2 ON m2.id = mu2.id
            WHERE m2.id_remetente = um.contato_id
              AND mu2.id_destinatario = :usuarioId
              AND mu2.horario_lida IS NULL
        ) AS qtdNaoLidas
    FROM UltimasMensagens um
    JOIN usuario u ON u.id = um.contato_id
    WHERE um.rn = 1
    ORDER BY um.horario_enviada DESC
    """, nativeQuery = true)
    List<ConversaProjection> buscarPainelConversas(@Param("usuarioId") long usuarioId);
}
