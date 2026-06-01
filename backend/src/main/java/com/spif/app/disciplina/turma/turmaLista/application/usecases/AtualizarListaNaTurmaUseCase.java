package com.spif.app.disciplina.turma.turmaLista.application.usecases;

import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.disciplina.turma.turmaLista.application.ports.in.AtualizarListaNaTurmaInputPort;
import com.spif.app.disciplina.turma.turmaLista.application.ports.out.TurmaListaRepository;
import com.spif.app.disciplina.turma.turmaLista.domain.TurmaLista;
import com.spif.app.disciplina.turma.turmaLista.web.dto.in.AtualizarListaTurmaRequest;
import com.spif.app.disciplina.turma.turmaLista.web.dto.out.TurmaListaResponse;
import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarListaNaTurmaUseCase implements AtualizarListaNaTurmaInputPort {

    private final TurmaListaRepository turmaListaRepository;
    private final TurmaRepository turmaRepository;
    private final ListaProblemasRepository listaProblemasRepository;
    private final IngressaRepository ingressaRepository;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public TurmaListaResponse atualizar(long disciplinaId, long turmaId, long listaId, AtualizarListaTurmaRequest request) {
        long professorId = AuthUtil.getUsuarioId();

        Turma t = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));
        ListaProblemas l = listaProblemasRepository.buscarPorId(listaId).orElseThrow(() -> new IllegalArgumentException("Lista de problemas não encontrada."));

        if (l.getProfessorId() != professorId) {
            throw new SecurityException("Você não é o dono dessa lista.");
        }

        if (!ingressaRepository.existe(t.getId(), professorId)) {
            throw new SecurityException("Você não participa dessa turma.");
        }

        TurmaLista tl = turmaListaRepository.buscarPorId(l.getId(), t.getId()).orElseThrow(() -> new IllegalArgumentException("Essa lista não pertence a essa turma."));
        TurmaLista atualizado = tl.atualizar(request.dataInicio(), request.dataFim(), request.ativo());
        TurmaLista salvo = turmaListaRepository.salvar(atualizado);
        return TurmaListaResponse.fromDomain(salvo);
    }
}
