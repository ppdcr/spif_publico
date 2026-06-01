package com.spif.app.disciplina.turma.infrastructure.persistence.mapper;

import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.infrastructure.persistence.entity.TurmaEntity;

public class TurmaEntityMapper {

    public static Turma toDomain(TurmaEntity e) {
        if (e == null) return null;
        return new Turma(e.getId(), e.getNome(), e.getCodigoConvite(), e.getDisciplinaId());
    }

    public static TurmaEntity toEntity(Turma t) {
        if (t == null) return null;
        TurmaEntity e = new TurmaEntity();
        e.setId(t.getId());
        e.setNome(t.getNome());
        e.setCodigoConvite(t.getCodigoConvite());
        e.setDisciplinaId(t.getDisciplinaId());
        return e;
    }
}
