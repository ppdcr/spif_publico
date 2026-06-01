package com.spif.app.percurso.nivel.web.dto.out;

import com.spif.app.percurso.nivel.domain.Nivel;
import lombok.Data;

@Data
public class NivelResponse {
    private long id;
    private String nome;
    private int ordem;
    private String descricao;
    private Double porcentagemConclusao;

    public static NivelResponse fromProjection(NivelProjection p) {
        NivelResponse r = new NivelResponse();

        r.id = p.getId();
        r.nome = p.getNome();
        r.ordem = p.getOrdem();
        r.descricao = p.getDescricao();
        r.porcentagemConclusao = p.getPorcentagemConclusao();
        return r;
    }

    public static NivelResponse fromDomain(Nivel n) {
        if (n == null) return null;
        NivelResponse r = new NivelResponse();
        r.id = n.getId();
        r.nome = n.getNome();
        r.ordem = n.getOrdem();
        r.descricao = n.getDescricao();
        return r;
    }
}
