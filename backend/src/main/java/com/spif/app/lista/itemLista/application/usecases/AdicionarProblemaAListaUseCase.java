package com.spif.app.lista.itemLista.application.usecases;

import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.lista.itemLista.application.ports.in.AdicionarProblemaAListaInputPort;
import com.spif.app.lista.itemLista.application.ports.out.ItemListaRepository;
import com.spif.app.lista.itemLista.domain.ItemLista;
import com.spif.app.lista.itemLista.web.dto.in.AdicionarProblemaAListaRequest;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.domain.Problema;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdicionarProblemaAListaUseCase implements AdicionarProblemaAListaInputPort {

    private final ItemListaRepository itemListaRepository;
    private final ListaProblemasRepository listaProblemasRepository;
    private final ProblemaRepository problemaRepository;


    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public void criar(long listaId, AdicionarProblemaAListaRequest request) {
        long professorId = AuthUtil.getUsuarioId();

        ListaProblemas l = listaProblemasRepository.buscarPorIdEProfessor(professorId, listaId).orElseThrow(() -> new IllegalArgumentException("Lista de problemas não encontrada para esse professor."));
        Problema p = problemaRepository.buscarPorId(request.problemaId()).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado."));
        ItemLista i = ItemLista.criar(l.getId(), p.getId());
        itemListaRepository.salvar(i);
    }
}
