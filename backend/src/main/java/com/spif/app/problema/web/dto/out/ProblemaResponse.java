package com.spif.app.problema.web.dto.out;

import com.spif.app.problema.casoTeste.web.dto.out.CasoTesteResponse;
import com.spif.app.problema.domain.Problema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class ProblemaResponse {
    private long id;
    private String titulo;
    private String enunciado;
    private String entrada;
    private String saida;
    private int dificuldade;
    private BigDecimal tempoLimite;
    private int memoriaLimiteMb;
    private long professorId;
    private OffsetDateTime dataCriacao;
    private List<String> assuntos;
    private List<CasoTesteResponse> casosVisiveis;

    public static ProblemaResponse fromDomain(Problema p) {
        if (p == null) return null;
        ProblemaResponse r = new ProblemaResponse();
        r.setId(p.getId());
        r.setTitulo(p.getTitulo());
        r.setEnunciado(p.getEnunciado());
        r.setEntrada(p.getEntrada());
        r.setSaida(p.getSaida());
        r.setDificuldade(p.getDificuldade());
        r.setTempoLimite(p.getTempoLimite());
        r.setMemoriaLimiteMb(p.getMemoriaLimiteMb());
        r.setProfessorId(p.getProfessorId());
        r.setDataCriacao(p.getDataCriacao());
        r.setAssuntos(p.getAssuntos());
        return r;
    }
}
