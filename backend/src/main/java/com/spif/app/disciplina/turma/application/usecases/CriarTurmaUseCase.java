package com.spif.app.disciplina.turma.application.usecases;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.disciplina.turma.application.ports.in.CriarTurmaInputPort;
import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.disciplina.turma.ingressa.domain.Ingressa;
import com.spif.app.disciplina.turma.web.dto.in.CriarTurmaRequest;
import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CriarTurmaUseCase implements CriarTurmaInputPort {

    private final TurmaRepository turmaRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final CursaRepository cursaRepository;
    private final IngressaRepository ingressaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public TurmaResponse criar(long disciplinaId, CriarTurmaRequest request) {
        Disciplina d = disciplinaRepository.buscarPorId(disciplinaId).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));

        long usuarioId = AuthUtil.getUsuarioId();

        if (!cursaRepository.existe(usuarioId, d.getId())) {
            throw new IllegalAccessError("Você não ministra essa disciplina.");
        }

        Turma t = Turma.criar(request.nome(), d.getId());
        Turma saved = turmaRepository.salvar(t);

        Ingressa ingressa = Ingressa.criar(saved.getId(), usuarioId);
        ingressaRepository.salvar(ingressa);

        return TurmaResponse.fromDomain(saved);
    }
}
