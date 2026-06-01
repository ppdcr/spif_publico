package com.spif.app.disciplina.cursa.application.usecases;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.cursa.application.ports.in.DesmatricularDisciplinaInputPort;
import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.cursa.domain.Cursa;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class DesmatricularDisciplinaUseCase implements DesmatricularDisciplinaInputPort {

    private final CursaRepository cursaRepository;
    private final DisciplinaRepository disciplinaRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public void desmatricular(long disciplinaId) {
        long usuarioId = AuthUtil.getUsuarioId();

        Disciplina d = disciplinaRepository.buscarPorId(disciplinaId).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));

        Cursa existente = cursaRepository.buscarPorId(usuarioId, d.getId()).orElseThrow(() -> new IllegalArgumentException("Matrícula não encontrada"));
        cursaRepository.deletar(existente.getUsuarioId(), existente.getDisciplinaId());
    }
}
