package com.spif.app.competicao.infrastructure.persistence.repository;

import java.time.Instant;

public interface CompeticaoProjection {
    Long getId();
    String getNome();
    String getDescricao();
    Instant getDataInicio();
    Instant getDataFim();
    boolean isAtiva();
    Double getPorcentagemConclusao();
}
