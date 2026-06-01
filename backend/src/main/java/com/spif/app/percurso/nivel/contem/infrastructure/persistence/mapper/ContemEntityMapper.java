package com.spif.app.percurso.nivel.contem.infrastructure.persistence.mapper;

import com.spif.app.percurso.nivel.contem.domain.Contem;
import com.spif.app.percurso.nivel.contem.infrastructure.persistence.entity.ContemEntity;

public class ContemEntityMapper {
    public static Contem toDomain(ContemEntity e) {
        if (e == null) return null;
        return new Contem(e.getNivelId(), e.getProblemaId());
    }

    public static ContemEntity toEntity(Contem c) {
        if (c == null) return null;
        ContemEntity e = new ContemEntity();
        e.setNivelId(c.getNivelId());
        e.setProblemaId(c.getProblemaId());
        return e;
    }
}
