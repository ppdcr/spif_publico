package com.spif.app.competicao.participacao.infrastructure.persistence;

import com.spif.app.competicao.participacao.application.ports.out.ParticipacaoRepository;
import com.spif.app.competicao.participacao.domain.Participacao;
import com.spif.app.competicao.participacao.infrastructure.persistence.entity.ParticipacaoEntity;
import com.spif.app.competicao.participacao.infrastructure.persistence.entity.ParticipacaoId;
import com.spif.app.competicao.participacao.infrastructure.persistence.mapper.ParticipacaoEntityMapper;
import com.spif.app.competicao.participacao.infrastructure.persistence.repository.ParticipacaoJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ParticipacaoRepositoryImpl implements ParticipacaoRepository {

    private final ParticipacaoJpaRepository repo;

    @Override
    public Participacao salvar(Participacao p) {
        ParticipacaoEntity e = ParticipacaoEntityMapper.toEntity(p);

        ParticipacaoEntity saved = repo.save(e);
        return ParticipacaoEntityMapper.toDomain(saved);
    }

    @Override
    public void deletar(long competicaoId, long problemaId) {
        ParticipacaoId id = new ParticipacaoId(competicaoId, problemaId);
        repo.deleteById(id);
    }

    @Override
    public Optional<Participacao> buscar(long competicaoId, long problemaId) {
        ParticipacaoId id = new ParticipacaoId(competicaoId, problemaId);
        return repo.findById(id).map(ParticipacaoEntityMapper::toDomain);
    }

    @Override
    public List<Participacao> listarPorCompeticao(long competicaoId) {
        return repo.findByCompeticaoId(competicaoId).stream().map(ParticipacaoEntityMapper::toDomain).toList();
    }

    @Override
    public void deletarPorCompeticao(long competicaoId) {
        repo.deleteByCompeticaoId(competicaoId);
    }
}
