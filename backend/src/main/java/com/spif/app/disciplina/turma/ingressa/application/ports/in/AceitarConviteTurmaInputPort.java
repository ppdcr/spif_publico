package com.spif.app.disciplina.turma.ingressa.application.ports.in;

import com.spif.app.disciplina.turma.ingressa.web.dto.out.IngressaResponse;

public interface AceitarConviteTurmaInputPort {
    void aceitar(long disciplinaId, long turmaId);
    IngressaResponse aceitarQrcode(long disciplinaId, String codigoConvite);
}
