package com.spif.app.disciplina.cursa.infrastructure.persistence;

import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.cursa.domain.Cursa;
import com.spif.app.disciplina.cursa.infrastructure.persistence.entity.CursaEntity;
import com.spif.app.disciplina.cursa.infrastructure.persistence.entity.CursaId;
import com.spif.app.disciplina.cursa.infrastructure.persistence.mapper.CursaEntityMapper;
import com.spif.app.disciplina.cursa.infrastructure.persistence.repository.CursaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CursaRepositoryImpl implements CursaRepository {

    private final CursaJpaRepository repo;

    @Override
    public Cursa salvar(Cursa cursa) {
        CursaEntity entity = CursaEntityMapper.toEntity(cursa);
        CursaEntity saved = repo.save(entity);
        return CursaEntityMapper.toDomain(saved);
    }

    @Override
    public void deletar(long usuarioId, long disciplinaId) {
        CursaId id = new CursaId(usuarioId, disciplinaId);
        repo.deleteById(id);
    }

    @Override
    public Optional<Cursa> buscarPorId(long usuarioId, long disciplinaId) {
        CursaId id = new CursaId(usuarioId, disciplinaId);
        return repo.findById(id).map(CursaEntityMapper::toDomain);
    }

    @Override
    public List<Cursa> listarDisciplinasAtivasPorUsuario(long usuarioId) {
        return repo.findByUsuarioIdAndAtivoTrue(usuarioId).stream().map(CursaEntityMapper::toDomain).toList();
    }

    @Override
    public List<Cursa> listarConvitesDisciplinasPorAluno(long usuarioId) {
        return repo.findByUsuarioIdAndAtivoFalse(usuarioId).stream().map(CursaEntityMapper::toDomain).toList();
    }

    @Override
    public List<Cursa> listarUsuariosAtivosPorDisciplina(long disciplinaId) {
        return repo.findByDisciplinaIdAndAtivoTrue(disciplinaId).stream().map(CursaEntityMapper::toDomain).toList();
    }

    @Override
    public List<Cursa> listarAlunosConvidadosPorDisciplina(long disciplinaId) {
        return repo.findByDisciplinaIdAndAtivoFalse(disciplinaId).stream().map(CursaEntityMapper::toDomain).toList();
    }

    @Override
    public boolean existe(long usuarioId, long disciplinaId) {
        CursaId id = new CursaId(usuarioId, disciplinaId);
        return repo.existsById(id);
    }

    @Override
    public void deletarPorDisciplina(long disciplinaId) {
        repo.deleteAllByDisciplinaId(disciplinaId);
    }
}
