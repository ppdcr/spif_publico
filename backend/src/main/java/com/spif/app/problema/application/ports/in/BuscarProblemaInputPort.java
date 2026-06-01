package com.spif.app.problema.application.ports.in;

import com.spif.app.problema.web.dto.out.ProblemaResponse;

public interface BuscarProblemaInputPort {
    ProblemaResponse buscarPorId(Long id);
}
