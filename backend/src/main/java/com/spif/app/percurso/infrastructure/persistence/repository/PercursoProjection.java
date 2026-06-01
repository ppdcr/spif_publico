package com.spif.app.percurso.infrastructure.persistence.repository;

public interface PercursoProjection {
    Long getId();
    String getNome();
    String getDescricao();
    Double getPorcentagemConclusao();
}
