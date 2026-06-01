package com.spif.app.problema.web.dto.in;

import jakarta.validation.constraints.Min;

import java.util.List;

public record ProblemaFiltroRequest(
        String titulo,
        Integer dificuldade,
        List<String> assuntos,
        @Min(0) Integer pagina,
        @Min(1) Integer tamanho,
        Long nivelId,
        Long competicaoId,
        Long listaId
) {
    public ProblemaFiltroRequest {
        if (pagina == null) pagina = 0;
        if (tamanho == null) tamanho = 20;
    }
}
