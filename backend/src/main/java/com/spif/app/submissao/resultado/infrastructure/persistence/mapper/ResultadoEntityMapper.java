package com.spif.app.submissao.resultado.infrastructure.persistence.mapper;

import com.spif.app.submissao.resultado.domain.Resultado;
import com.spif.app.submissao.resultado.infrastructure.persistence.entity.ResultadoEntity;

public class ResultadoEntityMapper {
    public static Resultado toDomain(ResultadoEntity e) {
        if (e == null) return null;
        return new Resultado(e.getSubmissaoId(), e.getCasoTesteId(), e.getSaida(), e.getErro(), e.getTempoGasto());
    }

    public static ResultadoEntity toEntity(Resultado r) {
        if (r == null) return null;
        ResultadoEntity e = new ResultadoEntity();
        e.setSubmissaoId(r.getSubmissaoId());
        e.setCasoTesteId(r.getCasoTesteId());
        e.setSaida(r.getSaida());
        e.setErro(r.getErro());
        e.setTempoGasto(r.getTempoGasto());
        return e;
    }
}
