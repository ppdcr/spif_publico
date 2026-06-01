package com.spif.app.problema.casoTeste.web.dto.out;

import com.spif.app.problema.casoTeste.domain.CasoTeste;
import lombok.Data;

@Data
public class CasoTesteResponse {
    private long id;
    private String entrada;
    private String saida;
    private int ordem;
    private boolean visivel;

    public static CasoTesteResponse fromDomain(CasoTeste c) {
        CasoTesteResponse r = new CasoTesteResponse();
        r.setId(c.getId());
        r.setEntrada(c.getEntrada());
        r.setSaida(c.getSaida());
        r.setOrdem(c.getOrdem());
        return r;
    }
}
