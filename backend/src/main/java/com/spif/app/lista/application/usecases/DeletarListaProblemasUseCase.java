package com.spif.app.lista.application.usecases;

import com.spif.app.lista.application.ports.in.DeletarListaProblemasInputPort;
import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarListaProblemasUseCase implements DeletarListaProblemasInputPort {

    private final ListaProblemasRepository listaProblemasRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public void deletarListaProblemas(long listaId) {
        long professorId = AuthUtil.getUsuarioId();

        ListaProblemas lista = listaProblemasRepository.buscarPorIdEProfessor(professorId, listaId).orElseThrow(() -> new IllegalArgumentException("Lista de problemas não encontrada para esse professor."));
        listaProblemasRepository.deletar(lista.getId());
    }
}
