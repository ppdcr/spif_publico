package com.spif.app.disciplina.turma.turmaLista.application.usecases;

import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.disciplina.turma.turmaLista.application.ports.in.ListarListasDaTurmaInputPort;
import com.spif.app.disciplina.turma.turmaLista.application.ports.out.TurmaListaRepository;
import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.lista.web.dto.out.ListaProblemasResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarListasDaTurmaUseCase implements ListarListasDaTurmaInputPort {

    private final TurmaListaRepository turmaListaRepository;
    private final ListaProblemasRepository listaProblemasRepository;
    private final IngressaRepository ingressaRepository;
    private final TurmaRepository turmaRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<ListaProblemasResponse> listarAtivasComProgresso(long disciplinaId, long turmaId) {
        long usuarioId = AuthUtil.getUsuarioId();
        Turma t = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));

        boolean isProfessor = AuthUtil.getUsuarioLogado().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PROFESSOR"));

        return listaProblemasRepository.listarAtivasComProgresso(t.getId(), usuarioId).stream()
                .map(lp -> {
                    ListaProblemasResponse response = ListaProblemasResponse.fromProjection(lp);
                    if (isProfessor) response.setPorcentagemConclusao(null);
                    return response;
                }).toList();
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public List<ListaProblemasResponse> listarListasInativasPorTurma(long disciplinaId, long turmaId) {
        long professorId = AuthUtil.getUsuarioId();

        Turma t = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));

        if (!ingressaRepository.existe(t.getId(), professorId)) {
            throw new IllegalArgumentException("Você não participa dessa turma.");
        }

        return turmaListaRepository.listarListasInativasPorTurma(turmaId).stream()
                .map(tl -> {
                    ListaProblemas l = listaProblemasRepository.buscarPorId(tl.getListaId()).orElseThrow(() -> new IllegalArgumentException("Lista de problemas não encontrada."));
                    return ListaProblemasResponse.fromDomain(l);
                }).toList();
    }
}
