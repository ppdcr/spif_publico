package com.spif.app.problema.application.usecases;

import com.spif.app.problema.application.ports.in.ListarProblemasProfessorInputPort;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.web.dto.out.ProblemaResumoResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarProblemasProfessorUseCase implements ListarProblemasProfessorInputPort {

    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public List<ProblemaResumoResponse> listarProblemasAtivosProfessor() {
        long professorId = AuthUtil.getUsuarioId();

        return problemaRepository.listarAtivosPorProfessor(professorId).stream().map(ProblemaResumoResponse::fromDomain).toList();
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public List<ProblemaResumoResponse> listarProblemasInativosProfessor() {
        long professorId = AuthUtil.getUsuarioId();

        return problemaRepository.listarInativosPorProfessor(professorId).stream().map(ProblemaResumoResponse::fromDomain).toList();
    }
}
