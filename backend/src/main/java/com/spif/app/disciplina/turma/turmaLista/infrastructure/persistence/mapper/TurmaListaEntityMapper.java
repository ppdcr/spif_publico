package com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence.mapper;

import com.spif.app.disciplina.turma.turmaLista.domain.TurmaLista;
import com.spif.app.disciplina.turma.turmaLista.infrastructure.persistence.entity.TurmaListaEntity;

public class TurmaListaEntityMapper {

    public static TurmaLista toDomain(TurmaListaEntity e) {
        if (e == null) return null;
        return new TurmaLista(e.getListaId(), e.getTurmaId(), e.getDataInicio(), e.getDataFim(), e.isAtivo());
    }

    public static TurmaListaEntity toEntity(TurmaLista t) {
        if (t == null) return null;
        TurmaListaEntity e = new TurmaListaEntity();
        e.setListaId(t.getListaId());
        e.setTurmaId(t.getTurmaId());
        e.setDataInicio(t.getDataInicio());
        e.setDataFim(t.getDataFim());
        e.setAtivo(t.isAtivo());
        return e;
    }
}
