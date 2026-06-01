package com.spif.app.competicao.application.ports.in;

import com.spif.app.competicao.web.dto.in.AtualizarCompeticaoRequest;
import com.spif.app.competicao.web.dto.out.CompeticaoResponse;

public interface AtualizarCompeticaoInputPort {
    CompeticaoResponse atualizar(long idCompeticao, AtualizarCompeticaoRequest request);
}
