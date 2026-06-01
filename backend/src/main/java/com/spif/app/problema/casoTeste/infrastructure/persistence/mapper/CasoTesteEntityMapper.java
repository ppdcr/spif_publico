package com.spif.app.problema.casoTeste.infrastructure.persistence.mapper;

import com.spif.app.problema.casoTeste.domain.CasoTeste;
import com.spif.app.problema.casoTeste.infrastructure.persistence.entity.CasoTesteEntity;

public class CasoTesteEntityMapper {

    public static CasoTeste toDomain(CasoTesteEntity e) {
        if (e == null) return null;
        return new CasoTeste(e.getId(), e.getProblemaId(), e.getEntrada(), e.getSaida(), e.isVisivel(), e.getOrdem());
    }

    public static CasoTesteEntity toEntity(CasoTeste d) {
        if (d == null) return null;
        CasoTesteEntity e = new CasoTesteEntity();
        e.setId(d.getId());
        e.setEntrada(d.getEntrada());
        e.setSaida(d.getSaida());
        e.setVisivel(d.isVisivel());
        e.setOrdem(d.getOrdem());
        e.setProblemaId(d.getProblemaId());
        return e;
    }
}
