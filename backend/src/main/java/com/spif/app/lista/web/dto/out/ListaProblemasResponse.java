package com.spif.app.lista.web.dto.out;

import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.lista.infrastructure.persistence.repository.ListaProjection;
import lombok.Data;

import java.time.OffsetDateTime;
import java.time.ZoneId;

@Data
public class ListaProblemasResponse {
    private long id;
    private String titulo;
    private String descricao;
    private long professorId;
    private OffsetDateTime dataCriacao;
    private Double porcentagemConclusao;
    private OffsetDateTime dataInicio;
    private OffsetDateTime dataFim;

    public static ListaProblemasResponse fromProjection(ListaProjection lp) {
        ListaProblemasResponse r = new ListaProblemasResponse();

        r.id = lp.getId();
        r.titulo = lp.getTitulo();
        r.descricao = lp.getDescricao();
        r.professorId = lp.getProfessorId();
        r.dataCriacao = lp.getDataCriacao().atZone(ZoneId.of("America/Sao_Paulo")).toOffsetDateTime();
        r.porcentagemConclusao = lp.getPorcentagemConclusao();
        r.dataInicio = lp.getDataInicio() != null ? lp.getDataInicio().atZone(ZoneId.of("America/Sao_Paulo")).toOffsetDateTime() : null;
        r.dataFim = lp.getDataFim() != null ? lp.getDataFim().atZone(ZoneId.of("America/Sao_Paulo")).toOffsetDateTime() : null;
        return r;
    }

    public static ListaProblemasResponse fromDomain(ListaProblemas l) {
        return fromDomain(l, null, null);
    }

    public static ListaProblemasResponse fromDomain(ListaProblemas l, OffsetDateTime dataInicio, OffsetDateTime dataFim) {
        if (l == null) return null;
        ListaProblemasResponse r = new ListaProblemasResponse();
        r.id = l.getId();
        r.titulo = l.getTitulo();
        r.descricao = l.getDescricao();
        r.professorId = l.getProfessorId();
        r.dataCriacao = l.getDataCriacao();
        r.dataInicio = dataInicio;
        r.dataFim = dataFim;
        return r;
    }
}
