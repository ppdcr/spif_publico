package com.spif.app.competicao.application.ports.in;

import com.spif.app.competicao.web.dto.out.CompeticaoResponse;

import java.util.List;

public interface ListarCompeticoesInputPort {
    List<CompeticaoResponse> listarTodosAtivos();
    List<CompeticaoResponse> listarTodosInativos();
}
