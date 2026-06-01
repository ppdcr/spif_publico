package com.spif.app.competicao.participacao.application.ports.out;

import com.spif.app.competicao.participacao.domain.Participacao;

import java.util.List;
import java.util.Optional;

public interface ParticipacaoRepository {
    Participacao salvar(Participacao p);
    void deletar(long competicaoId, long problemaId);
    Optional<Participacao> buscar(long competicaoId, long problemaId);
    List<Participacao> listarPorCompeticao(long competicaoId);
    void deletarPorCompeticao(long competicaoId);
}
