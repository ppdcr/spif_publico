package com.spif.app.submissao.application.ports.in;

import com.spif.app.submissao.web.dto.out.SubmissaoResponse;

public interface BuscarSubmissaoInputPort {
    SubmissaoResponse buscar(long submissaoId);
}
