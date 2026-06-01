package com.spif.app.problema.casoTeste.application.ports.in;

import com.spif.app.problema.casoTeste.web.dto.in.CriarCasoTesteRequest;
import com.spif.app.problema.casoTeste.web.dto.out.CasoTesteResponse;

public interface CriarCasoTesteInputPort {
    CasoTesteResponse criar(long problemaId, CriarCasoTesteRequest request);
}
