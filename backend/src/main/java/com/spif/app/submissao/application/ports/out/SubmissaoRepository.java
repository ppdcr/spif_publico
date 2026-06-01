package com.spif.app.submissao.application.ports.out;

import com.spif.app.submissao.domain.Submissao;

import java.util.List;
import java.util.Optional;

public interface SubmissaoRepository {
    Submissao salvar(Submissao submissao);
    Optional<Submissao> buscarPorId(long id);
    List<Submissao> listarPorProblemaEAluno(long problemaId, long alunoId);
}