package com.spif.app.lista.application.usecases;

import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.disciplina.turma.turmaLista.application.ports.out.TurmaListaRepository;
import com.spif.app.disciplina.turma.turmaLista.domain.TurmaLista;
import com.spif.app.lista.application.ports.in.BuscarListaInputPort;
import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.lista.web.dto.out.ListaProblemasResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class BuscarListaUseCase implements BuscarListaInputPort {

    private final ListaProblemasRepository listaProblemasRepository;
    private final TurmaListaRepository turmaListaRepository;
    private final IngressaRepository ingressaRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public ListaProblemasResponse buscar(long listaId, Long turmaId) {
        long usuarioId = AuthUtil.getUsuarioId();

        ListaProblemas lista = listaProblemasRepository.buscarPorId(listaId).orElseThrow(() -> new IllegalArgumentException("Lista de problemas não encontrada."));

        OffsetDateTime dataInicio = null;
        OffsetDateTime dataFim = null;

        if (turmaId == null) {
            if (lista.getProfessorId() != usuarioId) {
                throw new SecurityException("Você não é o dono dessa lista e não especificou uma turma.");
            }
        } else {
            if (!ingressaRepository.existe(turmaId, usuarioId)) {
                throw new SecurityException("Você não participa dessa turma.");
            }

            TurmaLista tl = turmaListaRepository.buscarPorId(listaId, turmaId)
                    .orElseThrow(() -> new IllegalArgumentException("Essa lista não está vinculada a essa turma."));
            
            dataInicio = tl.getDataInicio();
            dataFim = tl.getDataFim();
        }

        return ListaProblemasResponse.fromDomain(lista, dataInicio, dataFim);
    }
}
