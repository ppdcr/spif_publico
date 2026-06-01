package com.spif.app.disciplina.turma.ingressa.application.ports.out;

import com.spif.app.disciplina.turma.ingressa.domain.Ingressa;

import java.util.List;
import java.util.Optional;

public interface IngressaRepository {
    Ingressa salvar(Ingressa ingressa);
    void deletar(long turmaId, long usuarioId);
    Optional<Ingressa> buscarPorId(long turmaId, long usuarioId);
    List<Ingressa> listarConvitesTurmaPorUsuario(long usuarioId);
    List<Ingressa> listarUsuariosAtivosPorTurma(long turmaId);
    List<Ingressa> listarUsuariosConvidadosPorTurma(long turmaId);
    boolean existe(long turmaId, long usuarioId);
    void deletarPorTurma(long turmaId);
}
