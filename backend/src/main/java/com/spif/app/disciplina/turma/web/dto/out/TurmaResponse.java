package com.spif.app.disciplina.turma.web.dto.out;

import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.infrastructure.persistence.repository.TurmaProjection;
import lombok.Data;

@Data
public class TurmaResponse {
    private long id;
    private String nome;
    private String codigoConvite;
    private Double porcentagemConclusao;

    public static TurmaResponse fromProjection(TurmaProjection tp) {
        TurmaResponse r = new TurmaResponse();
        r.id = tp.getId();
        r.nome = tp.getNome();
        r.codigoConvite = tp.getCodigoConvite();
        r.porcentagemConclusao = tp.getPorcentagemConclusao();
        return r;
    }

    public static TurmaResponse fromDomain(Turma t) {
        TurmaResponse r = new TurmaResponse();
        r.id = t.getId();
        r.nome = t.getNome();
        r.codigoConvite = t.getCodigoConvite();
        r.porcentagemConclusao = null;
        return r;
    }
}
