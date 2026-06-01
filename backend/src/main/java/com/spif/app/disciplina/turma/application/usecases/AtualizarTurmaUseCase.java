package com.spif.app.disciplina.turma.application.usecases;

import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.turma.application.ports.in.AtualizarTurmaInputPort;
import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.web.dto.in.AtualizarTurmaRequest;
import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarTurmaUseCase implements AtualizarTurmaInputPort {

    private final TurmaRepository turmaRepository;
    private final CursaRepository cursaRepository;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public TurmaResponse atualizar(long disciplinaId, long turmaId, AtualizarTurmaRequest request) {
        Turma existente = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));
        long usuarioId = AuthUtil.getUsuarioId();

        if (!cursaRepository.existe(usuarioId, existente.getDisciplinaId())) {
            throw new IllegalAccessError("Você não ministra essa disciplina.");
        }

        Turma atualizado = existente.atualizar(request.nome());
        Turma saved = turmaRepository.salvar(atualizado);
        return TurmaResponse.fromDomain(saved);
    }
}
