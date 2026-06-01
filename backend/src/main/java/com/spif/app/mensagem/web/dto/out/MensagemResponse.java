package com.spif.app.mensagem.web.dto.out;

import com.spif.app.mensagem.domain.*;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class MensagemResponse {
    private long id;
    private String conteudo;
    private OffsetDateTime horarioEnviada;
    private long remetenteId;
    private MensagemRole role;
    private long destinatarioId;
    private Long mensagemPaiId;
    private String conteudoMensagemPai;
    private OffsetDateTime horarioLida;
    private long problemaId;
    private Remetente remetente;

    public static MensagemResponse fromDomain(Mensagem m) {
        if (m == null) return null;
        MensagemResponse r = new MensagemResponse();
        r.id = m.getId();
        r.conteudo = m.getConteudo();
        r.horarioEnviada = m.getHorarioEnviada();
        r.remetenteId = m.getRemetenteId();
        r.role = m.getRole();
        if (m instanceof MensagemUsuario) r.destinatarioId = ((MensagemUsuario) m).getDestinatarioId();
        if (m instanceof MensagemUsuario) r.mensagemPaiId = ((MensagemUsuario) m).getMensagemPaiId();
        if (m instanceof MensagemUsuario) r.conteudoMensagemPai = ((MensagemUsuario) m).getConteudoMensagemPai();
        if (m instanceof MensagemUsuario) r.horarioLida = ((MensagemUsuario) m).getHorarioLida();
        if (m instanceof MensagemProblema) r.problemaId = ((MensagemProblema) m).getProblemaId();
        if (m instanceof MensagemProblema) r.remetente = ((MensagemProblema) m).getRemetente();
        return r;
    }
}
