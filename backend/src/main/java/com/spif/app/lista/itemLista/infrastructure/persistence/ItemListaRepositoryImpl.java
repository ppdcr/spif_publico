package com.spif.app.lista.itemLista.infrastructure.persistence;

import com.spif.app.lista.itemLista.application.ports.out.ItemListaRepository;
import com.spif.app.lista.itemLista.domain.ItemLista;
import com.spif.app.lista.itemLista.infrastructure.persistence.entity.ItemListaEntity;
import com.spif.app.lista.itemLista.infrastructure.persistence.entity.ItemListaId;
import com.spif.app.lista.itemLista.infrastructure.persistence.mapper.ItemListaEntityMapper;
import com.spif.app.lista.itemLista.infrastructure.persistence.repository.ItemListaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ItemListaRepositoryImpl implements ItemListaRepository {

    private final ItemListaJpaRepository repo;

    @Override
    public ItemLista salvar(ItemLista itemLista) {
        ItemListaEntity entity = ItemListaEntityMapper.toEntity(itemLista);

        ItemListaEntity saved = repo.save(entity);
        return ItemListaEntityMapper.toDomain(saved);
    }

    @Override
    public void deletar(long listaId, long problemaId) {
        ItemListaId id = new ItemListaId(listaId, problemaId);
        repo.deleteById(id);
    }
}
