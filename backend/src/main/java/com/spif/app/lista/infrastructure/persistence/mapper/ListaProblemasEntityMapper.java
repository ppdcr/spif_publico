package com.spif.app.lista.infrastructure.persistence.mapper;

import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.lista.infrastructure.persistence.entity.ListaProblemasEntity;

public class ListaProblemasEntityMapper {

    public static ListaProblemas toDomain(ListaProblemasEntity e) {
        if (e == null) return null;
        return new ListaProblemas(e.getId(), e.getProfessorId(), e.getTitulo(), e.getDescricao(), e.getDataCriacao());
    }

    public static ListaProblemasEntity toEntity(ListaProblemas l) {
        if (l == null) return null;
        ListaProblemasEntity e = new ListaProblemasEntity();
        e.setId(l.getId());
        e.setProfessorId(l.getProfessorId());
        e.setTitulo(l.getTitulo());
        e.setDescricao(l.getDescricao());
        e.setDataCriacao(l.getDataCriacao());
        return e;
    }
}
