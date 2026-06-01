package com.spif.app.problema.casoTeste.application.ports.in;

import com.spif.app.problema.casoTeste.web.dto.out.CasoTesteResponse;

import java.util.List;

public interface ListarCasosProblemaInputPort {
    List<CasoTesteResponse> listarTodos(long problemaId);
}
