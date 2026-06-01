package com.spif.app.disciplina.application.usecases;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.application.ports.in.BuscarDisciplinaInputPort;
import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BuscarDisciplinaUseCase implements BuscarDisciplinaInputPort {

    private final DisciplinaRepository disciplinaRepository;
    private final CursaRepository cursaRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public DisciplinaResponse buscar(long disciplinaId) {
        long professorId = AuthUtil.getUsuarioId();

        return disciplinaRepository.buscarPorId(disciplinaId).map(d -> {
            if (!cursaRepository.existe(professorId, d.getId())) {
                throw new SecurityException("Você não ministra essa disciplina.");
            }

            return DisciplinaResponse.fromDomain(d);
        }).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));
    }
}
