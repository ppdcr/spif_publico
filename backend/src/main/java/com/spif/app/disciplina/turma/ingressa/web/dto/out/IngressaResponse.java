package com.spif.app.disciplina.turma.ingressa.web.dto.out;

import com.spif.app.disciplina.turma.ingressa.domain.Ingressa;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class IngressaResponse {
    private long turmaId;
    private long usuarioId;
    private OffsetDateTime dataIngresso;
    private boolean ativo;

    public static IngressaResponse fromDomain(Ingressa i) {
        if (i == null) return null;
        IngressaResponse r = new IngressaResponse();
        r.turmaId = i.getTurmaId();
        r.usuarioId = i.getUsuarioId();
        r.dataIngresso = i.getDataIngresso();
        r.ativo = i.isAtivo();
        return r;
    }
}
