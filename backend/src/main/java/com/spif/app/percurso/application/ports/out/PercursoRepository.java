package com.spif.app.percurso.application.ports.out;

import com.spif.app.percurso.domain.Percurso;
import com.spif.app.percurso.infrastructure.persistence.repository.PercursoProjection;

import java.util.List;
import java.util.Optional;

public interface PercursoRepository {
    Percurso salvar(Percurso percurso);
    Optional<Percurso> buscarPorId(long percursoId);
    void deletar(long percursoId);
    List<PercursoProjection> listarPercursosComProgresso(long alunoId);
}
