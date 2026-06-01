package com.spif.app.submissao.application.ports.in;

import com.spif.app.submissao.web.dto.in.CriarSubmissaoRequest;
import com.spif.app.submissao.web.dto.out.SubmissaoResumoResponse;

public interface CriarSubmissaoInputPort {
    SubmissaoResumoResponse criar(long problemaId, CriarSubmissaoRequest request);
}
