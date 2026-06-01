package com.spif.app.problema.casoTeste.infrastructure.persistence;

import com.spif.app.problema.casoTeste.application.ports.out.CasoTesteRepository;
import com.spif.app.problema.casoTeste.domain.CasoTeste;
import com.spif.app.problema.casoTeste.infrastructure.persistence.entity.CasoTesteEntity;
import com.spif.app.problema.casoTeste.infrastructure.persistence.mapper.CasoTesteEntityMapper;
import com.spif.app.problema.casoTeste.infrastructure.persistence.repository.CasoTesteJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CasoTesteRepositoryImpl implements CasoTesteRepository {

    private final CasoTesteJpaRepository repo;

    @Override
    public CasoTeste salvar(CasoTeste c) {
        CasoTesteEntity e = CasoTesteEntityMapper.toEntity(c);
        CasoTesteEntity saved = repo.save(e);
        return CasoTesteEntityMapper.toDomain(saved);
    }

    @Override
    public Optional<CasoTeste> buscarPorId(long problemaId, long casoId) {
        return repo.findByIdAndProblemaId(casoId, problemaId).map(CasoTesteEntityMapper::toDomain);
    }

    @Override
    public void remover(long id) {
        repo.deleteById(id);
    }

    @Override
    public List<CasoTeste> listarPorProblemaOrdenado(long problemaId) {
        return repo.findByProblemaIdOrderByOrdem(problemaId).stream().map(CasoTesteEntityMapper::toDomain).toList();
    }

    @Override
    public List<CasoTeste> listarVisiveisPorProblema(long problemaId) {
        return repo.findByProblemaIdAndVisivelTrueOrderByOrdem(problemaId).stream().map(CasoTesteEntityMapper::toDomain).collect(Collectors.toList());
    }
}
