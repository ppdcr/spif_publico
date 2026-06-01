package com.spif.app.percurso.nivel.application.usecases;

import com.spif.app.percurso.nivel.application.ports.in.ListarNiveisDoPercursoInputPort;
import com.spif.app.percurso.nivel.application.ports.out.NivelRepository;
import com.spif.app.percurso.nivel.web.dto.out.NivelResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarNiveisDoPercursoUseCase implements ListarNiveisDoPercursoInputPort {

    private final NivelRepository nivelRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<NivelResponse> listarTodos(long percursoId) {
        long usuarioId = AuthUtil.getUsuarioId();

        boolean isProfessor = AuthUtil.getUsuarioLogado().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PROFESSOR"));

        return nivelRepository.listarComProgresso(percursoId, usuarioId)
                .stream()
                .map(n -> {
                    NivelResponse response = NivelResponse.fromProjection(n);
                    if (isProfessor) response.setPorcentagemConclusao(null);
                    return response;
                })
                .toList();
    }
}
