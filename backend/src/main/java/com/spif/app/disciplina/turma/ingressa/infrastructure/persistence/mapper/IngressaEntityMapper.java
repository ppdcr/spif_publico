package com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.mapper;

import com.spif.app.disciplina.turma.ingressa.domain.Ingressa;
import com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.entity.IngressaEntity;

public class IngressaEntityMapper {

    public static Ingressa toDomain(IngressaEntity e) {
        if (e == null) return null;
        return new Ingressa(e.getTurmaId(), e.getUsuarioId(), e.getDataIngresso(), e.isAtivo());
    }

    public static IngressaEntity toEntity(Ingressa i) {
        if (i == null) return null;
        IngressaEntity e = new IngressaEntity();
        e.setTurmaId(i.getTurmaId());
        e.setUsuarioId(i.getUsuarioId());
        e.setDataIngresso(i.getDataIngresso());
        e.setAtivo(i.isAtivo());
        return e;
    }
}
