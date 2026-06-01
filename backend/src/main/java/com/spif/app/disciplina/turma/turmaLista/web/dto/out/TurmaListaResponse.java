package com.spif.app.disciplina.turma.turmaLista.web.dto.out;

import com.spif.app.disciplina.turma.turmaLista.domain.TurmaLista;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class TurmaListaResponse {
    private long listaId;
    private long turmaId;
    private OffsetDateTime dataInicio;
    private OffsetDateTime dataFim;
    private boolean ativo;

    public static TurmaListaResponse fromDomain(TurmaLista t) {
        if (t == null) return null;
        TurmaListaResponse r = new TurmaListaResponse();
        r.setListaId(t.getListaId());
        r.setTurmaId(t.getTurmaId());
        r.setDataInicio(t.getDataInicio());
        r.setDataFim(t.getDataFim());
        r.setAtivo(t.isAtivo());
        return r;
    }
}
