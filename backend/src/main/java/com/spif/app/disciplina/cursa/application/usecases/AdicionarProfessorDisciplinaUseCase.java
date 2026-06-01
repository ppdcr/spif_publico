package com.spif.app.disciplina.cursa.application.usecases;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.cursa.application.ports.in.AdicionarProfessorDisciplinaInputPort;
import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.cursa.domain.Cursa;
import com.spif.app.disciplina.cursa.web.dto.out.CursaResponse;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdicionarProfessorDisciplinaUseCase implements AdicionarProfessorDisciplinaInputPort {

    private final CursaRepository cursaRepository;
    private final DisciplinaRepository disciplinaRepository;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public CursaResponse adicionar(long disciplinaId) {
        long usuarioId = AuthUtil.getUsuarioId();

        Disciplina d = disciplinaRepository.buscarPorId(disciplinaId).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));

        if (cursaRepository.existe(usuarioId, d.getId())) {
            throw new IllegalStateException("Você já está matriculado nessa disciplina.");
        }

        Cursa cursa = Cursa.adicionarProfessor(usuarioId, disciplinaId);
        Cursa salvo = cursaRepository.salvar(cursa);
        return CursaResponse.fromDomain(salvo);
    }
}
