package com.spif.app.problema.application.ports.in;

import com.spif.app.problema.web.dto.out.ProblemaResumoResponse;
import com.spif.app.problema.web.dto.in.ProblemaFiltroRequest;
import org.springframework.data.domain.Page;

public interface ListarProblemasAtivosInputPort {
    Page<ProblemaResumoResponse> listarProblemas(ProblemaFiltroRequest filtro);
}
