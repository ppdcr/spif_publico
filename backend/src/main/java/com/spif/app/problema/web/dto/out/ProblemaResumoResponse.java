package com.spif.app.problema.web.dto.out;

import com.spif.app.problema.domain.Problema;
import com.spif.app.problema.infrastructure.persistence.repository.ProblemaResumoProjection;
import lombok.Data;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Data
public class ProblemaResumoResponse {
    private long id;
    private String titulo;
    private int dificuldade;
    private Boolean acertou;
    private List<String> assuntos;
    private boolean visivel;

    public static ProblemaResumoResponse fromProjection(ProblemaResumoProjection p) {
        List<String> categoriasList = p.getCategorias() != null
                ? Arrays.asList(p.getCategorias().split(", "))
                : Collections.emptyList();

        ProblemaResumoResponse r = new ProblemaResumoResponse();
        r.id = p.getId();
        r.titulo = p.getTitulo();
        r.dificuldade = p.getDificuldade();
        r.acertou = p.getResolvido();
        r.assuntos = categoriasList;
        return r;
    }

    public static ProblemaResumoResponse fromDomain(Problema p) {
        if (p == null) return null;
        ProblemaResumoResponse r = new ProblemaResumoResponse();
        r.id = p.getId();
        r.titulo = p.getTitulo();
        r.dificuldade = p.getDificuldade();
        r.assuntos = p.getAssuntos();
        r.visivel = p.isVisivel();
        return r;
    }
}
