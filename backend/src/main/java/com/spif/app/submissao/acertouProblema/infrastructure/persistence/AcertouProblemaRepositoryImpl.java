package com.spif.app.submissao.acertouProblema.infrastructure.persistence;

import com.spif.app.submissao.acertouProblema.domain.AcertouProblema;
import com.spif.app.submissao.acertouProblema.infrastructure.persistence.entity.AcertouProblemaEntity;
import com.spif.app.submissao.acertouProblema.infrastructure.persistence.mapper.AcertouProblemaEntityMapper;
import com.spif.app.submissao.acertouProblema.infrastructure.persistence.repository.AcertouProblemaJpaRepository;
import com.spif.app.submissao.acertouProblema.repository.AcertouProblemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AcertouProblemaRepositoryImpl implements AcertouProblemaRepository {

    private final AcertouProblemaJpaRepository repo;

    @Override
    public AcertouProblema salvar(AcertouProblema acertouProblema) {
        AcertouProblemaEntity entity = AcertouProblemaEntityMapper.toEntity(acertouProblema);
        AcertouProblemaEntity saved = repo.save(entity);

        return AcertouProblemaEntityMapper.toDomain(saved);
    }

    @Override
    public boolean acertouProblema(long alunoId, long problemaId) {
        return repo.existsByAlunoIdAndProblemaId(alunoId, problemaId);
    }
}
