package com.spif.app.disciplina.infrastructure.persistence.mapper;

import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.disciplina.infrastructure.persistence.entity.DisciplinaEntity;

public class DisciplinaEntityMapper {
    public static Disciplina toDomain(DisciplinaEntity e) {
        if (e == null) return null;
        return new Disciplina(e.getId(), e.getNome(), e.getAno());
    }

    public static DisciplinaEntity toEntity(Disciplina d) {
        if (d == null) return null;
        DisciplinaEntity e = new DisciplinaEntity();
        e.setId(d.getId());
        e.setNome(d.getNome());
        e.setAno(d.getAno());
        return e;
    }
}