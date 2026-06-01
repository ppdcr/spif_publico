package com.spif.app.percurso.nivel.application.ports.out;

import com.spif.app.percurso.nivel.domain.Nivel;
import com.spif.app.percurso.nivel.web.dto.out.NivelProjection;

import java.util.List;
import java.util.Optional;

public interface NivelRepository {
    Nivel salvar(Nivel nivel);
    Optional<Nivel> buscarPorIdEPercurso(long percursoId, long nivelId);
    void deletar(long id);
    List<Long> buscarNiveisRecemConcluidos(long usuarioId, long problemaId);
    List<NivelProjection> listarComProgresso(long percursoId, long usuarioId);
    Optional<Nivel> buscarPorId(long nivelId);
}
