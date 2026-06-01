package com.spif.app.competicao.application.usecases;

import com.spif.app.competicao.application.ports.in.DeletarCompeticaoInputPort;
import com.spif.app.competicao.application.ports.out.CompeticaoRepository;
import com.spif.app.competicao.domain.Competicao;
import com.spif.app.competicao.participacao.application.ports.out.ParticipacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarCompeticaoUseCase implements DeletarCompeticaoInputPort {

    private final CompeticaoRepository competicaoRepository;
    private final ParticipacaoRepository participacaoRepository;

    @Override
    @Transactional
    public void deletar(long competicaoId) {
        Competicao c = competicaoRepository.buscarPorId(competicaoId).orElseThrow(() -> new IllegalArgumentException("Competição não encontrada."));

        participacaoRepository.deletarPorCompeticao(c.getId());
        competicaoRepository.deletar(c.getId());
    }
}
