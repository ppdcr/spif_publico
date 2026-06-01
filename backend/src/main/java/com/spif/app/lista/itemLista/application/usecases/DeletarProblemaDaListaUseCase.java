package com.spif.app.lista.itemLista.application.usecases;

import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.lista.itemLista.application.ports.in.DeletarProblemaDaListaInputPort;
import com.spif.app.lista.itemLista.application.ports.out.ItemListaRepository;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.domain.Problema;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarProblemaDaListaUseCase implements DeletarProblemaDaListaInputPort {

    private final ItemListaRepository itemListaRepository;
    private final ListaProblemasRepository listaProblemasRepository;
    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public void deletar(long listaId, long problemaId) {
        long professorId = AuthUtil.getUsuarioId();

        ListaProblemas l = listaProblemasRepository.buscarPorIdEProfessor(professorId, listaId).orElseThrow(() -> new IllegalArgumentException("Lista de problemas não encontrada para esse professor."));
        Problema p = problemaRepository.buscarPorId(problemaId).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado."));

        itemListaRepository.deletar(l.getId(), p.getId());
    }
}
