package com.spif.app.lista.application.usecases;

import com.spif.app.lista.application.ports.in.CriarListaProblemasInputPort;
import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.lista.web.dto.in.CriarListaProblemasRequest;
import com.spif.app.lista.web.dto.out.ListaProblemasResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CriarListaProblemasUseCase implements CriarListaProblemasInputPort {

    private final ListaProblemasRepository listaProblemasRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public ListaProblemasResponse criarListaProblemas(CriarListaProblemasRequest request) {
        long professorId = AuthUtil.getUsuarioId();

        ListaProblemas lista = ListaProblemas.criar(professorId, request.titulo(), request.descricao());
        ListaProblemas saved = listaProblemasRepository.salvar(lista);

        return ListaProblemasResponse.fromDomain(saved);
    }
}
