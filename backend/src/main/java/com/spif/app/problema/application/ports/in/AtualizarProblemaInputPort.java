package com.spif.app.problema.application.ports.in;

import com.spif.app.problema.web.dto.in.AtualizarProblemaRequest;
import com.spif.app.problema.web.dto.out.ProblemaResponse;

public interface AtualizarProblemaInputPort {
    ProblemaResponse atualizar(Long id, AtualizarProblemaRequest request);
}
