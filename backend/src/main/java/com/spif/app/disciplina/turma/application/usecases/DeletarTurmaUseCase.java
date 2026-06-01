package com.spif.app.disciplina.turma.application.usecases;

import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.turma.application.ports.in.DeletarTurmaInputPort;
import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarTurmaUseCase implements DeletarTurmaInputPort {

    private final TurmaRepository turmaRepository;
    private final CursaRepository cursaRepository;
    private final IngressaRepository ingressaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public void deletar(long disciplinaId, long turmaId) {
        Turma existente = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));
        long usuarioId = AuthUtil.getUsuarioId();

        if (!cursaRepository.existe(usuarioId, existente.getDisciplinaId())) {
            throw new IllegalAccessError("Você não ministra essa disciplina.");
        }

        if (!ingressaRepository.existe(turmaId, usuarioId))

        ingressaRepository.deletarPorTurma(existente.getId());
        turmaRepository.deletar(existente.getId());
    }
}
