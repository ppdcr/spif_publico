package com.spif.app.percurso.nivel.infrastructure.persistence.mapper;

import com.spif.app.percurso.nivel.domain.Nivel;
import com.spif.app.percurso.nivel.infrastructure.persistence.entity.NivelEntity;

public class NivelEntityMapper {

    public static Nivel toDomain(NivelEntity e) {
        if (e == null) return null;
        return new Nivel(e.getId(), e.getNome(), e.getOrdem(), e.getDescricao(), e.getPercursoId());
    }

    public static NivelEntity toEntity(Nivel n) {
        if (n == null) return null;
        NivelEntity e = new NivelEntity();
        e.setId(n.getId());
        e.setNome(n.getNome());
        e.setOrdem(n.getOrdem());
        e.setDescricao(n.getDescricao());
        e.setPercursoId(n.getPercursoId());
        return e;
    }

}
