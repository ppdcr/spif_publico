package com.spif.app.usuario.infrastructure.persistence.repository;

import com.spif.app.usuario.infrastructure.persistence.entity.AlunoEntity;
import com.spif.app.usuario.infrastructure.persistence.entity.ProfessorEntity;
import com.spif.app.usuario.infrastructure.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long> {
    Optional<UsuarioEntity> findByProntuario(String prontuario);
    Optional<UsuarioEntity> findByEmail(String email);

    @Query("SELECT u FROM UsuarioEntity u WHERE LOWER(u.nickname) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<UsuarioEntity> findByNicknameContainingIgnoreCase(@org.springframework.data.repository.query.Param("nome") String nome);

    @Query("SELECT a FROM AlunoEntity a ORDER BY a.pontos DESC LIMIT 10")
    List<AlunoEntity> findAllAlunosOrderByPontosDesc();

    @Query("SELECT p FROM ProfessorEntity p ORDER BY p.elogios DESC LIMIT 10")
    List<ProfessorEntity> findAllProfessoresOrderByElogiosDesc();
}