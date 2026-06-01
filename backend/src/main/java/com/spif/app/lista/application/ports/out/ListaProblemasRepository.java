package com.spif.app.lista.application.ports.out;

import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.lista.infrastructure.persistence.repository.ListaProjection;

import java.util.List;
import java.util.Optional;

public interface ListaProblemasRepository {
    ListaProblemas salvar(ListaProblemas listaProblemas);
    void deletar(long listaId);
    Optional<ListaProblemas> buscarPorId(long listaId);
    Optional<ListaProblemas> buscarPorIdEProfessor(long professorId, long listaId);
    List<Long> buscarListasRecemConcluidas(long alunoId, long problemaId);
    List<ListaProjection> listarAtivasComProgresso(long turmaId, long usuarioId);

    List<ListaProblemas> buscarPorProfessorETitulo(long professorId, String titulo);
    List<ListaProblemas> buscarPorProfessor(long professorId);
}
