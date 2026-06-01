package com.spif.app.percurso.nivel.contem.application.ports.in;

public interface DeletarProblemaDoNivelInputPort {
    void deletar(long percursoId, long nivelId, long problemaId);
}
