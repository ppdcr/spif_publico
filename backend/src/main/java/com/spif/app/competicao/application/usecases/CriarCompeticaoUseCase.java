package com.spif.app.competicao.application.usecases;

import com.spif.app.competicao.application.ports.in.CriarCompeticaoInputPort;
import com.spif.app.competicao.application.ports.out.CompeticaoRepository;
import com.spif.app.competicao.domain.Competicao;
import com.spif.app.competicao.web.dto.in.CriarCompeticaoRequest;
import com.spif.app.competicao.web.dto.out.CompeticaoResponse;
import com.spif.app.shared.email.NotificarNovaCompeticao;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CriarCompeticaoUseCase implements CriarCompeticaoInputPort {

    private final CompeticaoRepository competicaoRepository;
    private final NotificarNovaCompeticao notificarNovaCompeticao;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public CompeticaoResponse criar(CriarCompeticaoRequest request) {

        Competicao competicao = Competicao.criar(request.nome(), request.descricao(), request.dataInicio(), request.dataFim());

        Competicao saved = competicaoRepository.salvar(competicao);
        notificarNovaCompeticao.carregarENotificar(saved.getId());
        return CompeticaoResponse.fromDomain(saved);
    }
}
