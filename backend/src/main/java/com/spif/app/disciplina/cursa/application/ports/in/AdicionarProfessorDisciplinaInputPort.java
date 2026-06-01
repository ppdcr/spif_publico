package com.spif.app.disciplina.cursa.application.ports.in;

import com.spif.app.disciplina.cursa.web.dto.out.CursaResponse;

public interface AdicionarProfessorDisciplinaInputPort {
    CursaResponse adicionar(long disciplinaId);
}
