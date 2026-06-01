package com.spif.app.competicao.participacao.application.ports.in;

public interface DeletarProblemaDeCompeticaoInputPort {
    void deletar(long competicaoId, long problemaId);
}
