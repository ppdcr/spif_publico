package com.spif.app.submissao.application.ports.in;

import com.spif.app.submissao.web.dto.out.SubmissaoResumoResponse;

import java.util.List;

public interface ListarSubmissoesInputPort {
    List<SubmissaoResumoResponse> listarTodos(long problemaId);
}
