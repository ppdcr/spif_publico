package com.spif.app.percurso.infrastructure.persistence.mapper;

import com.spif.app.percurso.domain.Percurso;
import com.spif.app.percurso.infrastructure.persistence.entity.PercursoEntity;

public class PercursoEntityMapper {
    public static Percurso toDomain(PercursoEntity e) {
        if (e == null) return null;
        return new Percurso(e.getId(), e.getNome(), e.getDescricao());
    }

    public static PercursoEntity toEntity(Percurso p) {
        if (p == null) return null;
        PercursoEntity e = new PercursoEntity();
        e.setId(p.getId());
        e.setNome(p.getNome());
        e.setDescricao(p.getDescricao());
        return e;
    }
}
