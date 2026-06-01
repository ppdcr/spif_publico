package com.spif.app.disciplina.turma.ingressa.application.usecases;

import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.ingressa.application.ports.in.DesmatricularTurmaInputPort;
import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.disciplina.turma.ingressa.domain.Ingressa;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DesmatricularTurmaUseCase implements DesmatricularTurmaInputPort {

    private final CursaRepository cursaRepository;
    private final IngressaRepository ingressaRepository;
    private final TurmaRepository turmaRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public void desmatricular(long disciplinaId, long turmaId) {
        long usuarioId = AuthUtil.getUsuarioId();

        Turma t = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));

        if (!cursaRepository.existe(usuarioId, t.getDisciplinaId())) {
            throw new SecurityException("Você não pertence a essa disciplina.");
        }

        Ingressa existente = ingressaRepository.buscarPorId(t.getId(), usuarioId).orElseThrow(() -> new IllegalArgumentException("Matricula não encontrada."));
        ingressaRepository.deletar(existente.getTurmaId(), existente.getUsuarioId());
    }
}
