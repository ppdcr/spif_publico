package com.spif.app.lista.infrastructure.persistence.repository;

import java.time.Instant;

public interface ListaProjection {
    Long getId();
    Long getProfessorId();
    String getTitulo();
    String getDescricao();
    Instant getDataCriacao();
    Double getPorcentagemConclusao();
    Instant getDataInicio();
    Instant getDataFim();
}
