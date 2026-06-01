package com.spif.app.problema.infrastructure.persistence.repository;

public interface ProblemaResumoProjection {
    long getId();
    String getTitulo();
    Integer getDificuldade();
    Boolean getResolvido();
    String getCategorias();
}
