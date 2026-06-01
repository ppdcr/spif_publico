package com.spif.app.mensagem.infrastructure.persistence.repository;

import java.time.Instant;

public interface ConversaProjection {
    Long getId();
    String getNickname();
    String getUltimaMensagem();
    Instant getHorarioEnviada();
    Instant getHorarioLida();
    Boolean getEnviadaPorVoce();
    Integer getQtdNaoLidas();
}
