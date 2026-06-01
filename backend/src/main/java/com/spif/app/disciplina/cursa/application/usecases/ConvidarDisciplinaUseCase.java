package com.spif.app.disciplina.cursa.application.usecases;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.cursa.application.ports.in.ConvidarDisciplinaInputPort;
import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.cursa.domain.Cursa;
import com.spif.app.disciplina.cursa.web.dto.in.MatricularCursaRequest;
import com.spif.app.disciplina.cursa.web.dto.out.CursaResponse;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.shared.email.NotificarConviteDisciplina;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class ConvidarDisciplinaUseCase implements ConvidarDisciplinaInputPort {

    private final CursaRepository cursaRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final NotificarConviteDisciplina notificarConviteDisciplina;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public CursaResponse convidar(long disciplinaId, MatricularCursaRequest request) {
        long alunoId = request.usuarioId();
        long professorId = AuthUtil.getUsuarioId();

        Disciplina d = disciplinaRepository.buscarPorId(disciplinaId).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));

        if (!cursaRepository.existe(professorId, d.getId())) {
            throw new SecurityException("Você não ministra essa disciplina.");
        }

        if (cursaRepository.existe(alunoId, d.getId())) {
            throw new IllegalStateException("Aluno já matriculado/convidado nesta disciplina.");
        }

        Cursa cursa = Cursa.convidar(alunoId, d.getId(), request.dataFim());
        Cursa salvo = cursaRepository.salvar(cursa);

        notificarConviteDisciplina.carregarENotificar(alunoId, d.getId());
        return CursaResponse.fromDomain(salvo);
    }
}
