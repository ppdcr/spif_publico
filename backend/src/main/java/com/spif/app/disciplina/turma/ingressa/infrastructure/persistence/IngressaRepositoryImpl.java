package com.spif.app.disciplina.turma.ingressa.infrastructure.persistence;

import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.disciplina.turma.ingressa.domain.Ingressa;
import com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.entity.IngressaEntity;
import com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.entity.IngressaId;
import com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.mapper.IngressaEntityMapper;
import com.spif.app.disciplina.turma.ingressa.infrastructure.persistence.repository.IngressaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class IngressaRepositoryImpl implements IngressaRepository {

    private final IngressaJpaRepository repo;

    @Override
    public Ingressa salvar(Ingressa ingressa) {
        IngressaEntity entity = IngressaEntityMapper.toEntity(ingressa);
        IngressaEntity saved = repo.save(entity);
        return IngressaEntityMapper.toDomain(saved);
    }

    @Override
    public void deletar(long turmaId, long usuarioId) {
        IngressaId id = new IngressaId(turmaId, usuarioId);
        repo.deleteById(id);
    }

    @Override
    public Optional<Ingressa> buscarPorId(long turmaId, long usuarioId) {
        IngressaId id = new IngressaId(turmaId, usuarioId);
        return repo.findById(id).map(IngressaEntityMapper::toDomain);
    }

    @Override
    public List<Ingressa> listarConvitesTurmaPorUsuario(long usuarioId) {
        return repo.findByUsuarioIdAndAtivoFalse(usuarioId).stream().map(IngressaEntityMapper::toDomain).toList();
    }

    @Override
    public List<Ingressa> listarUsuariosAtivosPorTurma(long turmaId) {
        return repo.findByTurmaIdAndAtivoTrue(turmaId).stream().map(IngressaEntityMapper::toDomain).toList();
    }

    @Override
    public List<Ingressa> listarUsuariosConvidadosPorTurma(long turmaId) {
        return repo.findByTurmaIdAndAtivoFalse(turmaId).stream().map(IngressaEntityMapper::toDomain).toList();
    }

    @Override
    public boolean existe(long turmaId, long usuarioId) {
        IngressaId id = new IngressaId(turmaId, usuarioId);
        return repo.existsById(id);
    }

    @Override
    public void deletarPorTurma(long turmaId) {
        repo.deleteAllByTurmaId(turmaId);
    }
}
