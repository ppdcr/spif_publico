package com.spif.app.mensagem.web;

import com.spif.app.mensagem.application.ports.in.MandarMensagemUsuarioInputPort;
import com.spif.app.mensagem.application.ports.in.MarcarMensagemComoLidaInputPort;
import com.spif.app.mensagem.web.dto.in.MandarMensagemUsuarioRequest;
import com.spif.app.mensagem.web.dto.out.MensagemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class MensagemWebSocketController {

    private final MandarMensagemUsuarioInputPort mandarMensagem;
    private final MarcarMensagemComoLidaInputPort marcarComoLida;
    private final SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/chat.enviar")
    public void enviarMensagem(
            @Payload MandarMensagemUsuarioRequest request,
            Principal principal  // ← Spring injeta automaticamente da sessão WS
    ) {
        if (principal == null) return; // proteção extra

        long remetenteId = Long.parseLong(principal.getName());

        // Chama o use case sem depender do SecurityContext
        MensagemResponse response = mandarMensagem.executar(remetenteId, request);

        messagingTemplate.convertAndSendToUser(
                String.valueOf(request.destinatarioId()),
                "/queue/mensagens",
                response
        );

        messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/confirmacoes",
                response
        );
    }

    @MessageMapping("/chat.ler")
    public void marcarComoLida(@Payload long contatoId, Principal principal) {
        if (principal == null) return;

        long usuarioId = Long.parseLong(principal.getName());
        marcarComoLida.marcar(contatoId, usuarioId);

        messagingTemplate.convertAndSendToUser(
                String.valueOf(contatoId),
                "/queue/notificacoes-leitura",
                Map.of("lidoPor", usuarioId)
        );
    }
}
