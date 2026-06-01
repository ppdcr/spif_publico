package com.spif.app.problema.casoTeste.application.ports.out;

import com.spif.app.problema.casoTeste.domain.CasoTeste;

import java.util.List;
import java.util.Optional;

public interface CasoTesteRepository {
    CasoTeste salvar(CasoTeste c);
    Optional<CasoTeste> buscarPorId(long problemaId, long casoId);
    void remover(long id);
    List<CasoTeste> listarPorProblemaOrdenado(long problemaId);
    List<CasoTeste> listarVisiveisPorProblema(long problemaId);
}
