package com.spif.app.disciplina.turma.application.ports.out;

import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.infrastructure.persistence.repository.TurmaProjection;

import java.util.List;
import java.util.Optional;

public interface TurmaRepository {
    Turma salvar(Turma turma);
    void deletar(long turmaId);
    Optional<Turma> buscarPorId(long disciplinaId, long turmaId);
    List<TurmaProjection> listarTurmasAtivasComProgresso(long disciplinaId, long usuarioId);
    Optional<Turma> buscarPorDisciplinaIdECodigoConvite(long disciplinaId, String codigoConvite);
}
