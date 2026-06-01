package com.spif.app.shared.websocket;

import com.spif.app.usuario.infrastructure.security.JwtTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketAuthenticatorInterceptor implements ChannelInterceptor {

    private final JwtTokenService tokenService;
    private static final String SECURITY_CONTEXT_SESSION_KEY = "SPRING_SECURITY_CONTEXT";

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                message, StompHeaderAccessor.class
        );

        if (accessor == null || !StompCommand.CONNECT.equals(accessor.getCommand())) {
            return message; // ignora tudo que não é CONNECT
        }

        String authHeader = accessor.getFirstNativeHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new MessageDeliveryException("Token ausente");
        }

        String token = authHeader.substring(7);
        if (!tokenService.validarToken(token)) {
            throw new MessageDeliveryException("Token inválido");
        }

        var userDetails = tokenService.obterUserDetails(token);
        var auth = new UsernamePasswordAuthenticationToken(
                String.valueOf(userDetails.getId()),
                null,
                userDetails.getAuthorities()
        );

        accessor.setUser(auth); // ← salva na sessão WS, Spring cuida do resto
        return message;
    }

    @Override
    public void afterSendCompletion(
            Message<?> message, MessageChannel channel, boolean sent, Exception ex
    ) {
        // Limpa o contexto após cada mensagem para não vazar entre threads do pool
        SecurityContextHolder.clearContext();
    }
}
