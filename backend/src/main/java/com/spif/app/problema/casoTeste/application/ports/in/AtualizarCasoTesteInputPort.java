package com.spif.app.problema.casoTeste.application.ports.in;

import com.spif.app.problema.casoTeste.web.dto.in.AtualizarCasoTesteRequest;
import com.spif.app.problema.casoTeste.web.dto.out.CasoTesteResponse;

public interface AtualizarCasoTesteInputPort {
    CasoTesteResponse atualizar(long problemaId, long casoId, AtualizarCasoTesteRequest request);
}
