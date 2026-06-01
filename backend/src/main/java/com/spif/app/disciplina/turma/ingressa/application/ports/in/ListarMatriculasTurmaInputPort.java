package com.spif.app.disciplina.turma.ingressa.application.ports.in;

import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;
import com.spif.app.usuario.web.dto.out.UsuarioResumoResponse;

import java.util.List;

public interface ListarMatriculasTurmaInputPort {
    List<TurmaResponse> listarTurmasAtivasPorUsuario(long disciplinaId);
    List<UsuarioResumoResponse> listarUsuariosAtivosPorTurma(long disciplinaId, long turmaId);
}
