package com.spif.app.disciplina.turma.infrastructure.persistence.repository;

public interface TurmaProjection {
    Long getId();
    String getNome();
    Double getPorcentagemConclusao();
    String getCodigoConvite();
}
