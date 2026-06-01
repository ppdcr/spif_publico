package com.spif.app.percurso.nivel.contem.infrastructure.persistence;

import com.spif.app.percurso.nivel.contem.application.ports.out.ContemRepository;
import com.spif.app.percurso.nivel.contem.domain.Contem;
import com.spif.app.percurso.nivel.contem.infrastructure.persistence.entity.ContemEntity;
import com.spif.app.percurso.nivel.contem.infrastructure.persistence.entity.ContemId;
import com.spif.app.percurso.nivel.contem.infrastructure.persistence.mapper.ContemEntityMapper;
import com.spif.app.percurso.nivel.contem.infrastructure.persistence.repository.ContemJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ContemRepositoryImpl implements ContemRepository {

    private final ContemJpaRepository repo;

    @Override
    public Contem salvar(Contem contem) {
        ContemEntity entity = ContemEntityMapper.toEntity(contem);

        ContemEntity saved = repo.save(entity);
        return ContemEntityMapper.toDomain(saved);
    }

    @Override
    public void deletar(long nivelId, long problemaId) {
        ContemId id = new ContemId(nivelId, problemaId);
        repo.deleteById(id);
    }
}
