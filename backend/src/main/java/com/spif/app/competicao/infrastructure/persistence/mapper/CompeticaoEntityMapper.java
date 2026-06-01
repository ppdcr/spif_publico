package com.spif.app.competicao.infrastructure.persistence.mapper;

import com.spif.app.competicao.domain.Competicao;
import com.spif.app.competicao.infrastructure.persistence.entity.CompeticaoEntity;

public class CompeticaoEntityMapper {
    public static Competicao toDomain(CompeticaoEntity e) {
        if (e == null) return null;
        return new Competicao(e.getId(), e.getNome(), e.getDescricao(), e.getDataInicio(), e.getDataFim(), e.isAtiva());
    }

    public static CompeticaoEntity toEntity(Competicao c) {
        if (c == null) return null;
        CompeticaoEntity e = new CompeticaoEntity();
        e.setId(c.getId());
        e.setNome(c.getNome());
        e.setDescricao(c.getDescricao());
        e.setDataInicio(c.getDataInicio());
        e.setDataFim(c.getDataFim());
        e.setAtiva(c.isAtiva());
        return e;
    }
}
