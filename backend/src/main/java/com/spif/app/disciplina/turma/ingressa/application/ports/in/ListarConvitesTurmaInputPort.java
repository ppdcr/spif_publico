package com.spif.app.disciplina.turma.ingressa.application.ports.in;

import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;
import com.spif.app.usuario.web.dto.out.UsuarioResumoResponse;

import java.util.List;

public interface ListarConvitesTurmaInputPort {
    List<TurmaResponse> listarConvitesTurmaPorUsuario(long disciplinaId);
    List<UsuarioResumoResponse> listarUsuariosConvidadosPorTurma(long disciplinaId, long turmaId);
}
