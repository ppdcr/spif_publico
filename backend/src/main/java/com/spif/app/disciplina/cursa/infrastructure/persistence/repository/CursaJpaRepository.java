package com.spif.app.disciplina.cursa.infrastructure.persistence.repository;

import com.spif.app.disciplina.cursa.infrastructure.persistence.entity.CursaEntity;
import com.spif.app.disciplina.cursa.infrastructure.persistence.entity.CursaId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CursaJpaRepository extends JpaRepository<CursaEntity, CursaId> {
    List<CursaEntity> findByDisciplinaIdAndAtivoTrue(long disciplinaId);
    List<CursaEntity> findByUsuarioIdAndAtivoTrue(long usuarioId);
    List<CursaEntity> findByDisciplinaIdAndAtivoFalse(long disciplinaId);
    List<CursaEntity> findByUsuarioIdAndAtivoFalse(long usuarioId);
    void deleteAllByDisciplinaId(long disciplinaId);
}
