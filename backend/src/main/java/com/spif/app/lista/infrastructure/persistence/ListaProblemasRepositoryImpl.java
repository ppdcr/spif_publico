package com.spif.app.lista.infrastructure.persistence;

import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.lista.infrastructure.persistence.entity.ListaProblemasEntity;
import com.spif.app.lista.infrastructure.persistence.mapper.ListaProblemasEntityMapper;
import com.spif.app.lista.infrastructure.persistence.repository.ListaProblemasJpaRepository;
import com.spif.app.lista.infrastructure.persistence.repository.ListaProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ListaProblemasRepositoryImpl implements ListaProblemasRepository {

    private final ListaProblemasJpaRepository repo;

    @Override
    public ListaProblemas salvar(ListaProblemas listaProblemas) {
        ListaProblemasEntity entity = ListaProblemasEntityMapper.toEntity(listaProblemas);

        ListaProblemasEntity saved = repo.save(entity);
        return ListaProblemasEntityMapper.toDomain(saved);
    }

    @Override
    public void deletar(long listaId) {
        repo.deleteById(listaId);
    }

    @Override
    public Optional<ListaProblemas> buscarPorIdEProfessor(long professorId, long listaId) {
        return repo.findByIdAndProfessorId(listaId, professorId).map(ListaProblemasEntityMapper::toDomain);
    }

    @Override
    public List<Long> buscarListasRecemConcluidas(long alunoId, long problemaId) {
        return repo.buscarListasRecemConcluidas(alunoId, problemaId).stream().toList();
    }

    @Override
    public List<ListaProjection> listarAtivasComProgresso(long turmaId, long usuarioId) {
        return repo.listarAtivasComProgresso(turmaId, usuarioId).stream().toList();
    }

    @Override
    public List<ListaProblemas> buscarPorProfessorETitulo(long professorId, String titulo) {
        return repo.findByProfessorIdAndTituloContainingIgnoreCase(professorId, titulo).stream().map(ListaProblemasEntityMapper::toDomain).toList();
    }

    @Override
    public List<ListaProblemas> buscarPorProfessor(long professorId) {
        return repo.findByProfessorId(professorId).stream().map(ListaProblemasEntityMapper::toDomain).toList();
    }

    @Override
    public Optional<ListaProblemas> buscarPorId(long listaId) {
        return repo.findById(listaId).map(ListaProblemasEntityMapper::toDomain);
    }
}
