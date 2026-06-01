package com.spif.app.competicao.participacao.infrastructure.persistence.repository;

import com.spif.app.competicao.participacao.infrastructure.persistence.entity.ParticipacaoEntity;
import com.spif.app.competicao.participacao.infrastructure.persistence.entity.ParticipacaoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipacaoJpaRepository extends JpaRepository<ParticipacaoEntity, ParticipacaoId> {
    List<ParticipacaoEntity> findByCompeticaoId(Long competicaoId);
    void deleteByCompeticaoId(Long competicaoId);
}
