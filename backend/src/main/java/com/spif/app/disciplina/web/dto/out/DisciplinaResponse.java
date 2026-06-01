package com.spif.app.disciplina.web.dto.out;

import com.spif.app.disciplina.domain.Disciplina;
import lombok.Data;

@Data
public class DisciplinaResponse {
    private long id;
    private String nome;
    private int ano;
    private Boolean ministra;

    public static DisciplinaResponse fromDomain(Disciplina d) {
        if (d == null) return null;
        DisciplinaResponse r = new DisciplinaResponse();
        r.id = d.getId();
        r.nome = d.getNome();
        r.ano = d.getAno();
        r.ministra = null;
        return r;
    }
}