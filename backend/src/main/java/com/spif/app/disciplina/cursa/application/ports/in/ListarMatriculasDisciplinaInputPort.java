package com.spif.app.disciplina.cursa.application.ports.in;

import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;
import com.spif.app.usuario.web.dto.out.UsuarioResumoResponse;

import java.util.List;

public interface ListarMatriculasDisciplinaInputPort {
    List<DisciplinaResponse> listarDisciplinasAtivasPorUsuario();
    List<UsuarioResumoResponse> listarUsuariosAtivosPorDisciplina(long disciplinaId);
}
