package com.spif.app.disciplina.cursa.application.ports.out;

import com.spif.app.disciplina.cursa.domain.Cursa;

import java.util.List;
import java.util.Optional;

public interface CursaRepository {
    Cursa salvar(Cursa cursa);
    void deletar(long usuarioId, long disciplinaId);
    Optional<Cursa> buscarPorId(long usuarioId, long disciplinaId);
    List<Cursa> listarDisciplinasAtivasPorUsuario(long usuarioId);
    List<Cursa> listarConvitesDisciplinasPorAluno(long usuarioId);
    List<Cursa> listarUsuariosAtivosPorDisciplina(long disciplinaId);
    List<Cursa> listarAlunosConvidadosPorDisciplina(long disciplinaId);
    boolean existe(long usuarioId, long disciplinaId);
    void deletarPorDisciplina(long disciplinaId);
}
