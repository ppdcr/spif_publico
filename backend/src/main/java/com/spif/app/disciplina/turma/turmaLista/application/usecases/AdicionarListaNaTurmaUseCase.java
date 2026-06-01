package com.spif.app.disciplina.turma.turmaLista.application.usecases;

import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.disciplina.turma.turmaLista.application.ports.in.AdicionarListaNaTurmaInputPort;
import com.spif.app.disciplina.turma.turmaLista.application.ports.out.TurmaListaRepository;
import com.spif.app.disciplina.turma.turmaLista.domain.TurmaLista;
import com.spif.app.disciplina.turma.turmaLista.web.dto.in.AdicionarListaATurmaRequest;
import com.spif.app.disciplina.turma.turmaLista.web.dto.out.TurmaListaResponse;
import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.shared.email.NotificarNovaListaTurma;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdicionarListaNaTurmaUseCase implements AdicionarListaNaTurmaInputPort {

    private final TurmaListaRepository turmaListaRepository;
    private final TurmaRepository turmaRepository;
    private final IngressaRepository ingressaRepository;
    private final ListaProblemasRepository listaProblemasRepository;
    private final NotificarNovaListaTurma notificarNovaListaTurma;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public TurmaListaResponse adicionar(long disciplinaId, long turmaId, AdicionarListaATurmaRequest request) {
        long professorId = AuthUtil.getUsuarioId();

        Turma t = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));
        ListaProblemas l = listaProblemasRepository.buscarPorId(request.listaId()).orElseThrow(() -> new IllegalArgumentException("Lista de problemas não encontrada."));

        if (l.getProfessorId() != professorId) {
            throw new SecurityException("Você não é o dono dessa lista.");
        }

        if (!ingressaRepository.existe(t.getId(), professorId)) {
            throw new SecurityException("Você não participa dessa turma.");
        }

        if (turmaListaRepository.existe(l.getId(), t.getId())) {
            throw new IllegalArgumentException("Essa lista já pertence a essa turma.");
        }

        TurmaLista turmaLista = TurmaLista.criar(l.getId(), t.getId(), request.dataInicio(), request.dataFim());
        TurmaLista salvo = turmaListaRepository.salvar(turmaLista);

        notificarNovaListaTurma.carregarENotificar(t.getDisciplinaId(), t.getId(), l.getId());
        return TurmaListaResponse.fromDomain(salvo);
    }
}
