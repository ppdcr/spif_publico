package com.spif.app.problema.infrastructure.persistence.mapper;

import com.spif.app.problema.domain.Problema;
import com.spif.app.problema.infrastructure.persistence.entity.ProblemaEntity;

import java.util.Collections;
import java.util.List;

public class ProblemaEntityMapper {
    public static Problema toDomain(ProblemaEntity e, List<String> assuntos) {
        if (e == null) return null;
        List<String> a = assuntos == null ? Collections.emptyList() : List.copyOf(assuntos);
        return new Problema(e.getId(), e.getTitulo(), e.getEnunciado(), e.getEntrada(), e.getSaida(), e.getDificuldade() == null ? 0 : e.getDificuldade(), e.getTempoLimite(), e.getMemoriaLimiteMb(), e.isVisivel(), e.getProfessorId(), e.getDataCriacao(), a);
    }


    public static ProblemaEntity toEntity(Problema d) {
        if (d == null) return null;
        ProblemaEntity e = new ProblemaEntity();
        e.setId(d.getId());
        e.setTitulo(d.getTitulo());
        e.setEnunciado(d.getEnunciado());
        e.setEntrada(d.getEntrada());
        e.setSaida(d.getSaida());
        e.setDificuldade((short) d.getDificuldade());
        e.setTempoLimite(d.getTempoLimite());
        e.setMemoriaLimiteMb(d.getMemoriaLimiteMb());
        e.setVisivel(d.isVisivel());
        e.setProfessorId(d.getProfessorId());
        e.setDataCriacao(d.getDataCriacao());
        return e;
    }
}
