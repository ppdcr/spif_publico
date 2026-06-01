package com.spif.app.usuario.application.usecases;

import com.spif.app.usuario.application.ports.in.ListarRankingInputPort;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.web.dto.out.RankingResponse;
import com.spif.app.usuario.web.dto.out.UsuarioResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarRankingUseCase implements ListarRankingInputPort {

    private final UsuarioRepository usuarioRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public RankingResponse listarRanking() {
        List<UsuarioResponse> alunos = usuarioRepository.listarAlunosPorPontos()
                .stream()
                .map(UsuarioResponse::fromDomain)
                .toList();

        List<UsuarioResponse> professores = usuarioRepository.listarProfessoresPorElogios()
                .stream()
                .map(UsuarioResponse::fromDomain)
                .toList();

        return new RankingResponse(alunos, professores);
    }
}
