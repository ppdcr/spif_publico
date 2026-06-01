package com.spif.app.competicao.participacao.infrastructure.persistence.mapper;

import com.spif.app.competicao.participacao.domain.Participacao;
import com.spif.app.competicao.participacao.infrastructure.persistence.entity.ParticipacaoEntity;

public class ParticipacaoEntityMapper {
    public static Participacao toDomain(ParticipacaoEntity e) {
        if (e == null) return null;
        return new Participacao(e.getCompeticaoId(), e.getProblemaId());
    }

    public static ParticipacaoEntity toEntity(Participacao p) {
        if (p == null) return null;
        ParticipacaoEntity e = new ParticipacaoEntity();
        e.setCompeticaoId(p.getCompeticaoId());
        e.setProblemaId(p.getProblemaId());
        return e;
    }
}
