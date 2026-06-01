package com.spif.app.mensagem.application.ports.in;

import com.spif.app.mensagem.web.dto.out.ConversaResponse;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface ListarConversasInputPort {
    @PreAuthorize("isAuthenticated()")
    List<ConversaResponse> listar();
}
