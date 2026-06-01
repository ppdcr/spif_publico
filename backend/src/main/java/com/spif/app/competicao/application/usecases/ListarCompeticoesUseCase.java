package com.spif.app.competicao.application.usecases;

import com.spif.app.competicao.application.ports.in.ListarCompeticoesInputPort;
import com.spif.app.competicao.application.ports.out.CompeticaoRepository;
import com.spif.app.competicao.web.dto.out.CompeticaoResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarCompeticoesUseCase implements ListarCompeticoesInputPort {

    private final CompeticaoRepository competicoesRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<CompeticaoResponse> listarTodosAtivos() {
        boolean isProfessor = AuthUtil.getUsuarioLogado().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PROFESSOR"));

        if (isProfessor) {
            return competicoesRepository.listarAtivas().stream()
                    .map(CompeticaoResponse::fromDomain)
                    .toList();
        }

        long usuarioId = AuthUtil.getUsuarioId();
        return competicoesRepository.listarComProgresso(usuarioId).stream()
                .map(CompeticaoResponse::fromProjection)
                .toList();
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public List<CompeticaoResponse> listarTodosInativos() {
        return competicoesRepository.listarInativas().stream().map(CompeticaoResponse::fromDomain).toList();
    }
}
