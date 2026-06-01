package com.spif.app.problema.infrastructure.persistence;

import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.domain.Problema;
import com.spif.app.problema.infrastructure.persistence.assunto.AssuntoEntity;
import com.spif.app.problema.infrastructure.persistence.assunto.AssuntoJpaRepository;
import com.spif.app.problema.infrastructure.persistence.entity.ProblemaEntity;
import com.spif.app.problema.infrastructure.persistence.mapper.ProblemaEntityMapper;
import com.spif.app.problema.infrastructure.persistence.repository.ProblemaJpaRepository;
import com.spif.app.problema.infrastructure.persistence.repository.ProblemaResumoProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ProblemaRepositoryImpl implements ProblemaRepository {

    private final ProblemaJpaRepository repo;
    private final AssuntoJpaRepository assuntoRepo;

    @Override
    public Problema salvar(Problema problema) {
        ProblemaEntity entity = ProblemaEntityMapper.toEntity(problema);
        ProblemaEntity saved = repo.save(entity);

        assuntoRepo.deleteByProblemaId(saved.getId());

        if (problema.getAssuntos() != null && !problema.getAssuntos().isEmpty()) {
            List<AssuntoEntity> novosAssuntos = problema.getAssuntos().stream()
                    .map(cat -> {
                        AssuntoEntity a = new AssuntoEntity();
                        a.setProblemaId(saved.getId());
                        a.setCategoria(cat);
                        return a;
                    }).toList();

            assuntoRepo.saveAll(novosAssuntos); // Muito mais rápido que save() no loop
        }

        return ProblemaEntityMapper.toDomain(saved, problema.getAssuntos());
    }

    @Override
    public Optional<Problema> buscarPorId(long id) {
        return repo.findById(id).map(e -> {
            List<String> assuntos = assuntoRepo.findByProblemaId(e.getId()).stream().map(AssuntoEntity::getCategoria).toList();
            return ProblemaEntityMapper.toDomain(e, assuntos);
        });
    }

    @Override
    public Optional<Problema> buscarPorIdVisivel(long id) {
        return repo.findByIdAndVisivelTrue(id).map(e -> {
            List<String> assuntos = assuntoRepo.findByProblemaId(e.getId()).stream().map(AssuntoEntity::getCategoria).toList();
            return ProblemaEntityMapper.toDomain(e, assuntos);
        });
    }

    @Override
    public void remover(long id) {
        assuntoRepo.deleteByProblemaId(id);
        repo.deleteById(id);
    }

    @Override
    public Page<ProblemaResumoProjection> buscarProblemasResumidosPaginados(
            long usuarioId,
            Long nivelId,
            Long listaId,
            Long competicaoId,
            String titulo,
            Integer dificuldade,
            List<String> assuntos,
            Integer qtdAssuntos,
            Pageable pageable
    ) {
        return repo.buscarProblemasResumidosPaginados(usuarioId, nivelId, listaId, competicaoId, titulo, dificuldade, assuntos, qtdAssuntos, pageable);
    }

    @Override
    public List<Problema> listarAtivosPorProfessor(long professorId) {
        return repo.findByProfessorIdAndVisivelTrue(professorId).stream().map(e -> {
            List<String> assuntos = assuntoRepo.findByProblemaId(e.getId()).stream().map(AssuntoEntity::getCategoria).toList();
            return ProblemaEntityMapper.toDomain(e, assuntos);
        }).toList();
    }

    @Override
    public List<Problema> listarInativosPorProfessor(long professorId) {
        return repo.findByProfessorIdAndVisivelFalse(professorId).stream().map(e -> {
            List<String> assuntos = assuntoRepo.findByProblemaId(e.getId()).stream().map(AssuntoEntity::getCategoria).toList();
            return ProblemaEntityMapper.toDomain(e, assuntos);
        }).toList();
    }
}
