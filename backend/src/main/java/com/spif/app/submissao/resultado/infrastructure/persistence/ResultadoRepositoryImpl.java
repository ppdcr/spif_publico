package com.spif.app.submissao.resultado.infrastructure.persistence;

import com.spif.app.submissao.resultado.domain.Resultado;
import com.spif.app.submissao.resultado.infrastructure.persistence.entity.ResultadoEntity;
import com.spif.app.submissao.resultado.infrastructure.persistence.entity.ResultadoId;
import com.spif.app.submissao.resultado.infrastructure.persistence.mapper.ResultadoEntityMapper;
import com.spif.app.submissao.resultado.infrastructure.persistence.repository.ResultadoJpaRepository;
import com.spif.app.submissao.resultado.repository.ResultadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ResultadoRepositoryImpl implements ResultadoRepository {

    private final ResultadoJpaRepository repo;

    @Override
    public Resultado salvar(Resultado resultado) {
        ResultadoEntity entity = ResultadoEntityMapper.toEntity(resultado);

        ResultadoEntity saved = repo.save(entity);
        return ResultadoEntityMapper.toDomain(saved);
    }

    @Override
    public List<Resultado> buscarPorSubmissao(long submissaoId) {
        return repo.findBySubmissaoId(submissaoId).stream().map(ResultadoEntityMapper::toDomain).toList();
    }

    @Override
    public Optional<Resultado> buscarPorId(long submissaoId, long casoTesteId) {
        ResultadoId id = new ResultadoId(submissaoId, casoTesteId);
        return repo.findById(id).map(ResultadoEntityMapper::toDomain);
    }
}
