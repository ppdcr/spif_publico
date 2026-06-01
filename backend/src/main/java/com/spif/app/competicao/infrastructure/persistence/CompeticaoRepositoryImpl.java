package com.spif.app.competicao.infrastructure.persistence;

import com.spif.app.competicao.application.ports.out.CompeticaoRepository;
import com.spif.app.competicao.domain.Competicao;
import com.spif.app.competicao.infrastructure.persistence.entity.CompeticaoEntity;
import com.spif.app.competicao.infrastructure.persistence.mapper.CompeticaoEntityMapper;
import com.spif.app.competicao.infrastructure.persistence.repository.CompeticaoJpaRepository;
import com.spif.app.competicao.infrastructure.persistence.repository.CompeticaoProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CompeticaoRepositoryImpl implements CompeticaoRepository {

    private final CompeticaoJpaRepository repo;

    @Override
    public Competicao salvar(Competicao competicao) {
        CompeticaoEntity entity = CompeticaoEntityMapper.toEntity(competicao);

        CompeticaoEntity saved = repo.save(entity);

        return CompeticaoEntityMapper.toDomain(saved);
    }

    @Override
    public Optional<Competicao> buscarPorId(long idCompeticao) {
        return repo.findById(idCompeticao).map(CompeticaoEntityMapper::toDomain);
    }


    @Override
    public List<Long> buscarCompeticoesRecemConcluidas(long usuarioId, long problemaId) {
        return repo.buscarCompeticoesRecemConcluidas(usuarioId, problemaId).stream().toList();
    }

    @Override
    public List<CompeticaoProjection> listarComProgresso(long usuarioId) {
        return repo.listarComProgresso(usuarioId).stream().toList();
    }

    @Override
    public List<Competicao> listarAtivas() {
        return repo.findByAtivaTrue().stream().map(CompeticaoEntityMapper::toDomain).toList();
    }

    @Override
    public List<Competicao> listarInativas() {
        return repo.findByAtivaFalse().stream().map(CompeticaoEntityMapper::toDomain).toList();
    }

    @Override
    public void deletar(long competicaoId) {
        repo.deleteById(competicaoId);
    }
}
