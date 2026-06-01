package com.spif.app.disciplina.application.ports.out;

import com.spif.app.disciplina.domain.Disciplina;

import java.util.List;
import java.util.Optional;

public interface DisciplinaRepository {
    Disciplina salvar(Disciplina disciplina);
    Optional<Disciplina> buscarPorId(long idDisciplina);
    void deletar(long disciplinaId);

    List<Disciplina> buscarTodas();
}
