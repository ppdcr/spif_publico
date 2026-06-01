package com.spif.app.mensagem.application.usecases;

import com.spif.app.mensagem.application.ports.in.ListarMensagensUsuarioInputPort;
import com.spif.app.mensagem.application.ports.out.MensagemRepository;
import com.spif.app.mensagem.domain.MensagemUsuario;
import com.spif.app.mensagem.web.dto.out.MensagemResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarMensagensUsuarioUseCase implements ListarMensagensUsuarioInputPort {

    private final MensagemRepository mensagemRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<MensagemResponse> listar(long destinatarioId) {
        long usuarioLogadoId = AuthUtil.getUsuarioId();

        List<MensagemUsuario> historico = mensagemRepository.buscarConversaUsuario(usuarioLogadoId, destinatarioId);

        return historico.stream()
                .map(MensagemResponse::fromDomain)
                .toList();

    }
}
