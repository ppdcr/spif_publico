package com.spif.app.percurso.nivel.web.dto.out;

public interface NivelProjection {
    Long getId();
    String getNome();
    Integer getOrdem();
    String getDescricao();
    Double getPorcentagemConclusao();
}
