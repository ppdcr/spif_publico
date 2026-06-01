package com.spif.app.disciplina.cursa.web.dto.out;

import com.spif.app.disciplina.cursa.domain.Cursa;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class CursaResponse {
    private long disciplinaId;
    private long usuarioId;
    private OffsetDateTime dataInicio;
    private OffsetDateTime dataFim;
    private boolean ativo;

    public static CursaResponse fromDomain(Cursa c) {
        if (c == null) return null;
        CursaResponse r = new CursaResponse();
        r.setDisciplinaId(c.getDisciplinaId());
        r.setUsuarioId(c.getUsuarioId());
        r.setDataInicio(c.getDataInicio());
        r.setDataFim(c.getDataFim());
        r.setAtivo(c.isAtivo());
        return r;
    }
}
