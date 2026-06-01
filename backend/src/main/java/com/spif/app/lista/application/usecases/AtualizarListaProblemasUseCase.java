package com.spif.app.lista.application.usecases;

import com.spif.app.lista.application.ports.in.AtualizarListaProblemasInputPort;
import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.lista.web.dto.in.AtualizarListaProblemasRequest;
import com.spif.app.lista.web.dto.out.ListaProblemasResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarListaProblemasUseCase implements AtualizarListaProblemasInputPort {

    private final ListaProblemasRepository listaProblemasRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public ListaProblemasResponse atualizarListaProblemas(long listaId, AtualizarListaProblemasRequest request) {
        long professorId = AuthUtil.getUsuarioId();
        ListaProblemas lista = listaProblemasRepository.buscarPorIdEProfessor(professorId, listaId).orElseThrow(() -> new IllegalArgumentException("Lista de problemas não encontrada para esse professor."));

        ListaProblemas atualizado = lista.atualizar(request.titulo(), request.descricao());
        ListaProblemas saved = listaProblemasRepository.salvar(atualizado);

        return ListaProblemasResponse.fromDomain(saved);
    }
}
