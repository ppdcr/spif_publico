package com.spif.app.submissao.resultado.repository;

import com.spif.app.submissao.resultado.domain.Resultado;

import java.util.List;
import java.util.Optional;

public interface ResultadoRepository {
    Resultado salvar(Resultado resultado);
    List<Resultado> buscarPorSubmissao(long submissaoId);
    Optional<Resultado> buscarPorId(long submissaoId, long casoTesteId);
}
