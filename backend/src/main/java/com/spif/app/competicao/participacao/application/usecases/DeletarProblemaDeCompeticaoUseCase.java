package com.spif.app.competicao.participacao.application.usecases;

import com.spif.app.competicao.application.ports.out.CompeticaoRepository;
import com.spif.app.competicao.domain.Competicao;
import com.spif.app.competicao.participacao.application.ports.in.DeletarProblemaDeCompeticaoInputPort;
import com.spif.app.competicao.participacao.application.ports.out.ParticipacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarProblemaDeCompeticaoUseCase implements DeletarProblemaDeCompeticaoInputPort {

    private final ParticipacaoRepository participacaoRepository;
    private final CompeticaoRepository competicaoRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public void deletar(long competicaoId, long problemaId) {
        Competicao competicao = competicaoRepository.buscarPorId(competicaoId).orElseThrow(() -> new IllegalArgumentException("Competição não encontrada."));

        participacaoRepository.deletar(competicao.getId(), problemaId);
    }
}