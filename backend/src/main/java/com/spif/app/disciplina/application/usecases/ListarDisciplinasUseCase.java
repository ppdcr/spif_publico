package com.spif.app.disciplina.application.usecases;

import com.spif.app.disciplina.application.ports.in.ListarDisciplinasInputPort;
import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarDisciplinasUseCase implements ListarDisciplinasInputPort {

    private final DisciplinaRepository disciplinaRepository;
    private final CursaRepository cursaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public List<DisciplinaResponse> listarTodas() {
        long professorId = AuthUtil.getUsuarioId();
        return disciplinaRepository.buscarTodas().stream().map(d -> {
            DisciplinaResponse r = DisciplinaResponse.fromDomain(d);
            r.setMinistra(cursaRepository.existe(professorId, d.getId()));
            return r;
        }).toList();
    }
}
