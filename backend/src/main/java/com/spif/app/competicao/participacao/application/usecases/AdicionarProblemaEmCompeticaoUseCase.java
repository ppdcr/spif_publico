package com.spif.app.competicao.participacao.application.usecases;

import com.spif.app.competicao.application.ports.out.CompeticaoRepository;
import com.spif.app.competicao.domain.Competicao;
import com.spif.app.competicao.participacao.application.ports.in.AdicionarProblemaEmCompeticaoInputPort;
import com.spif.app.competicao.participacao.application.ports.out.ParticipacaoRepository;
import com.spif.app.competicao.participacao.domain.Participacao;
import com.spif.app.competicao.participacao.web.dto.in.AdicionarProblemaEmCompeticaoRequest;
import com.spif.app.competicao.participacao.web.dto.out.ParticipacaoResponse;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.domain.Problema;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdicionarProblemaEmCompeticaoUseCase implements AdicionarProblemaEmCompeticaoInputPort {

    private final ParticipacaoRepository participacaoRepository;
    private final ProblemaRepository problemaRepository;
    private final CompeticaoRepository competicaoRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public ParticipacaoResponse adicionar(long competicaoId, AdicionarProblemaEmCompeticaoRequest request) {
        Competicao c = competicaoRepository.buscarPorId(competicaoId).orElseThrow(() -> new IllegalArgumentException("Competição não encontrada"));

        List<Long> saved = new ArrayList<>();
        for (long id: request.problemaIds()) {
            Problema p = problemaRepository.buscarPorId(id).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado"));
            Participacao part = Participacao.criar(c.getId(), p.getId());
            participacaoRepository.salvar(part);
            saved.add(id);
        }

        return ParticipacaoResponse.fromList(saved);
    }
}
