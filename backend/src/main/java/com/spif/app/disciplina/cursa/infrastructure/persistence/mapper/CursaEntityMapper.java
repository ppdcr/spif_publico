package com.spif.app.disciplina.cursa.infrastructure.persistence.mapper;

import com.spif.app.disciplina.cursa.domain.Cursa;
import com.spif.app.disciplina.cursa.infrastructure.persistence.entity.CursaEntity;


public class CursaEntityMapper {
    public static Cursa toDomain(CursaEntity e) {
        if (e == null) return null;
        return new Cursa(e.getUsuarioId(), e.getDisciplinaId(), e.getDataInicio(), e.getDataFim(), e.isAtivo());
    }


    public static CursaEntity toEntity(Cursa d) {
        if (d == null) return null;
        CursaEntity e = new CursaEntity();
        e.setUsuarioId(d.getUsuarioId());
        e.setDisciplinaId(d.getDisciplinaId());
        e.setDataInicio(d.getDataInicio());
        e.setDataFim(d.getDataFim());
        e.setAtivo(d.isAtivo());
        return e;
    }
}
