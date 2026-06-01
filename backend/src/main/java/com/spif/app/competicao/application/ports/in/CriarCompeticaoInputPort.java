package com.spif.app.competicao.application.ports.in;

import com.spif.app.competicao.web.dto.in.CriarCompeticaoRequest;
import com.spif.app.competicao.web.dto.out.CompeticaoResponse;

public interface CriarCompeticaoInputPort {
    CompeticaoResponse criar(CriarCompeticaoRequest request);
}
