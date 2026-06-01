package com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.repository;

import com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.entity.IngressaEntity;
import com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.entity.IngressaId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngressaJpaRepository extends JpaRepository<IngressaEntity, IngressaId> {
    List<IngressaEntity> findByTurmaIdAndAtivoTrue(long turmaId);
    List<IngressaEntity> findByTurmaIdAndAtivoFalse(long turmaId);
    List<IngressaEntity> findByUsuarioIdAndAtivoFalse(long usuarioId);

    void deleteAllByTurmaId(long disciplinaId);
}
