package com.spif.app.submissao.infrastructure.persistence;

import com.spif.app.submissao.application.ports.out.SubmissaoRepository;
import com.spif.app.submissao.domain.Submissao;
import com.spif.app.submissao.infrastructure.persistence.entity.SubmissaoEntity;
import com.spif.app.submissao.infrastructure.persistence.mapper.SubmissaoEntityMapper;
import com.spif.app.submissao.infrastructure.persistence.repository.SubmissaoJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SubmissaoRepositoryImpl implements SubmissaoRepository {

    private final SubmissaoJpaRepository repo;

    @Override
    public Submissao salvar(Submissao submissao) {
        SubmissaoEntity entity = SubmissaoEntityMapper.toEntity(submissao);
        SubmissaoEntity saved = repo.save(entity);

        return SubmissaoEntityMapper.toDomain(saved);
    }

    @Override
    public Optional<Submissao> buscarPorId(long submissaoId) {
        return repo.findById(submissaoId).map(SubmissaoEntityMapper::toDomain);
    }

    @Override
    public List<Submissao> listarPorProblemaEAluno(long problemaId, long alunoId) {
        return repo.findByProblemaIdAndAlunoId(problemaId, alunoId).stream().map(SubmissaoEntityMapper::toDomain).toList();
    }
}
