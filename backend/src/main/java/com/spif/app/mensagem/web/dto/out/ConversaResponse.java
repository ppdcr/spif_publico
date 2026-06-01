package com.spif.app.mensagem.web.dto.out;

import lombok.Data;

import com.spif.app.mensagem.infrastructure.persistence.repository.ConversaProjection;

import java.time.OffsetDateTime;
import java.time.ZoneId;

@Data
public class ConversaResponse {
    private long id;
    private String nickname;
    private String ultimaMensagem;
    private OffsetDateTime horarioEnviada;
    private OffsetDateTime horarioLida;
    private boolean enviadaPorVoce;
    private int qtdNaoLidas;

    public static ConversaResponse fromProjection(ConversaProjection projection) {
    ConversaResponse r = new ConversaResponse();
    r.id = projection.getId();
    r.nickname = projection.getNickname();
    r.ultimaMensagem = projection.getUltimaMensagem();
    
    // Tratamento para horarioEnviada (geralmente nunca é nulo, mas por segurança:)
    if (projection.getHorarioEnviada() != null) {
        r.horarioEnviada = projection.getHorarioEnviada()
                .atZone(ZoneId.of("America/Sao_Paulo"))
                .toOffsetDateTime();
    }

    // CORREÇÃO: Tratamento para o campo que está causando o erro
    if (projection.getHorarioLida() != null) {
        r.horarioLida = projection.getHorarioLida()
                .atZone(ZoneId.of("America/Sao_Paulo"))
                .toOffsetDateTime();
    } else {
        r.horarioLida = null; // Garante que continue nulo sem disparar erro
    }

    r.enviadaPorVoce = projection.getEnviadaPorVoce();
    r.qtdNaoLidas = projection.getQtdNaoLidas();
    return r;
}
}
