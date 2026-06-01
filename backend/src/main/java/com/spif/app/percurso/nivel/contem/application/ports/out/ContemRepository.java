package com.spif.app.percurso.nivel.contem.application.ports.out;

import com.spif.app.percurso.nivel.contem.domain.Contem;

public interface ContemRepository {
    Contem salvar(Contem contem);
    void deletar(long nivelId, long problemaId);
}