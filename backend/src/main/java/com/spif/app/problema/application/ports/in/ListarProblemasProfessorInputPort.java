package com.spif.app.problema.application.ports.in;

import com.spif.app.problema.web.dto.out.ProblemaResumoResponse;

import java.util.List;

public interface ListarProblemasProfessorInputPort {
    List<ProblemaResumoResponse> listarProblemasInativosProfessor();
    List<ProblemaResumoResponse> listarProblemasAtivosProfessor();
}
