package com.spif.app.competicao.application.usecases;

import com.spif.app.competicao.application.ports.in.AtualizarCompeticaoInputPort;
import com.spif.app.competicao.application.ports.out.CompeticaoRepository;
import com.spif.app.competicao.domain.Competicao;
import com.spif.app.competicao.web.dto.in.AtualizarCompeticaoRequest;
import com.spif.app.competicao.web.dto.out.CompeticaoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarCompeticaoUseCase implements AtualizarCompeticaoInputPort {

    private final CompeticaoRepository competaoRepository;

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public CompeticaoResponse atualizar(long competicaoId, AtualizarCompeticaoRequest request) {
        Competicao existente = competaoRepository.buscarPorId(competicaoId)
                .orElseThrow(() -> new IllegalArgumentException("Competição não encontrada."));

        Competicao updated = existente.atualizar(
                request.nome(),
                request.descricao(),
                request.dataInicio(),
                request.dataFim(),
                request.ativa()
        );

        Competicao saved = competaoRepository.salvar(updated);
        return CompeticaoResponse.fromDomain(saved);
    }
}
