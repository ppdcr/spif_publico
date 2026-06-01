package com.spif.app.disciplina.turma.ingressa.application.usecases;

import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.ingressa.application.ports.in.ConvidarTurmaInputPort;
import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.disciplina.turma.ingressa.domain.Ingressa;
import com.spif.app.disciplina.turma.ingressa.web.dto.in.MatricularIngressaRequest;
import com.spif.app.disciplina.turma.ingressa.web.dto.out.IngressaResponse;
import com.spif.app.shared.email.NotificarConviteTurma;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConvidarTurmaUseCase implements ConvidarTurmaInputPort {

    private final TurmaRepository turmaRepository;
    private final IngressaRepository ingressaRepository;
    private final CursaRepository cursaRepository;
    private final NotificarConviteTurma notificarConviteTurma;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public IngressaResponse convidar(long disciplinaId, long turmaId, MatricularIngressaRequest request) {
        long convidadoId = request.usuarioId();
        long professorId = AuthUtil.getUsuarioId();

        Turma t = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));

        if (!ingressaRepository.existe(t.getId(), professorId)) {
            throw new SecurityException("Você não ministra essa disciplina ou turma.");
        }

        if (ingressaRepository.existe(t.getId(), convidadoId)) {
            throw new IllegalArgumentException("Usuário já pertence a essa turma.");
        }

        if (!cursaRepository.existe(convidadoId, t.getDisciplinaId())) {
            throw new IllegalArgumentException("Usuário não pertence a essa disciplina.");
        }

        Ingressa ingressa = Ingressa.convidar(t.getId(), convidadoId);
        Ingressa salvo = ingressaRepository.salvar(ingressa);

        notificarConviteTurma.carregarENotificar(convidadoId, t.getDisciplinaId(), t.getId());
        return IngressaResponse.fromDomain(salvo);
    }
}
