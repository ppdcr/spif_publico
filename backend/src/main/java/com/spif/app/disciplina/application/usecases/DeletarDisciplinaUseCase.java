package com.spif.app.disciplina.application.usecases;

import com.spif.app.disciplina.application.ports.in.DeletarDisciplinaInputPort;
import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarDisciplinaUseCase implements DeletarDisciplinaInputPort {

    private final DisciplinaRepository disciplinaRepository;
    private final CursaRepository cursaRepository;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public void deletar(long disciplinaId) {
        Disciplina d = disciplinaRepository.buscarPorId(disciplinaId).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));

        cursaRepository.deletarPorDisciplina(d.getId());
        disciplinaRepository.deletar(d.getId());
    }
}
