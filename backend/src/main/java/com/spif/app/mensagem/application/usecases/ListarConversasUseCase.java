package com.spif.app.mensagem.application.usecases;

import com.spif.app.mensagem.application.ports.in.ListarConversasInputPort;
import com.spif.app.mensagem.application.ports.out.MensagemRepository;
import com.spif.app.mensagem.web.dto.out.ConversaResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarConversasUseCase implements ListarConversasInputPort {

    private final MensagemRepository mensagemRepository;

    @PreAuthorize("isAuthenticated()")
    @Override
    public List<ConversaResponse> listar() {
        long usuarioId = AuthUtil.getUsuarioId();

        return mensagemRepository.buscarPainelConversas(usuarioId).stream().map(ConversaResponse::fromProjection).toList();
    }
}
