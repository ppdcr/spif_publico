package com.spif.app.percurso.application.usecases;

import com.spif.app.percurso.application.ports.in.ListarPercursoInputPort;
import com.spif.app.percurso.application.ports.out.PercursoRepository;
import com.spif.app.percurso.web.dto.out.PercursoResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarPercursoUseCase implements ListarPercursoInputPort {

    private final PercursoRepository percursoRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<PercursoResponse> listarTodos() {
        long usuarioId = AuthUtil.getUsuarioId();

        boolean isProfessor = AuthUtil.getUsuarioLogado().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PROFESSOR"));

        return percursoRepository.listarPercursosComProgresso(usuarioId)
                .stream()
                .map(p -> {
                    PercursoResponse response = PercursoResponse.fromProjection(p);
                    if (isProfessor) response.setPorcentagemConclusao(null);
                    return response;
                })
                .toList();
    }
}
