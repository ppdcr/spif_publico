package com.spif.app.competicao.application.ports.out;

import com.spif.app.competicao.domain.Competicao;
import com.spif.app.competicao.infrastructure.persistence.repository.CompeticaoProjection;

import java.util.List;
import java.util.Optional;

public interface CompeticaoRepository {
    Competicao salvar(Competicao competicao);
    Optional<Competicao> buscarPorId(long idCompeticao);
    List<Long> buscarCompeticoesRecemConcluidas(long usuarioId, long problemaId);
    List<CompeticaoProjection> listarComProgresso(long usuarioId);
    List<Competicao> listarAtivas();
    List<Competicao> listarInativas();

    void deletar(long competicaoId);
}
