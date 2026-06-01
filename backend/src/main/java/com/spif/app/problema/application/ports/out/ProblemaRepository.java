package com.spif.app.problema.application.ports.out;

import com.spif.app.problema.domain.Problema;
import com.spif.app.problema.infrastructure.persistence.repository.ProblemaResumoProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProblemaRepository {
    Problema salvar(Problema problema);
    Optional<Problema> buscarPorId(long id);
    Optional<Problema> buscarPorIdVisivel(long id);
    void remover(long id);
    Page<ProblemaResumoProjection> buscarProblemasResumidosPaginados(
            long usuarioId,
            Long nivelId,
            Long listaId,
            Long competicaoId,
            String titulo,
            Integer dificuldade,
            List<String> assuntos,
            Integer qtdAssuntos,
            Pageable pageable
    );
    List<Problema> listarAtivosPorProfessor(long professorId);
    List<Problema> listarInativosPorProfessor(long professorId);
}
