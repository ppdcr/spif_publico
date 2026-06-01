package com.spif.app.percurso.web.dto.out;

import com.spif.app.percurso.domain.Percurso;
import com.spif.app.percurso.infrastructure.persistence.repository.PercursoProjection;
import lombok.Data;

@Data
public class PercursoResponse {
    private long id;
    private String nome;
    private String descricao;
    private Double porcentagemConclusao;

    public static PercursoResponse fromProjection(PercursoProjection p) {
        PercursoResponse r = new PercursoResponse();
        r.id = p.getId();
        r.nome = p.getNome();
        r.descricao = p.getDescricao();
        r.porcentagemConclusao = p.getPorcentagemConclusao();
        return r;
    }

    public static PercursoResponse fromDomain(Percurso p) {
        if (p == null) return null;
        PercursoResponse r = new PercursoResponse();
        r.id = p.getId();
        r.nome = p.getNome();
        r.descricao = p.getDescricao();
        return r;
    }
}
