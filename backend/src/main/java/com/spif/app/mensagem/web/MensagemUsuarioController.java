package com.spif.app.mensagem.web;

import com.spif.app.mensagem.application.ports.in.ListarConversasInputPort;
import com.spif.app.mensagem.application.ports.in.ListarMensagensUsuarioInputPort;
import com.spif.app.mensagem.web.dto.out.ConversaResponse;
import com.spif.app.mensagem.web.dto.out.MensagemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/")
@RequiredArgsConstructor
public class MensagemUsuarioController {

    private final ListarMensagensUsuarioInputPort listarMensagensUsuario;
    private final ListarConversasInputPort listarConversas;

    @GetMapping("usuarios/{destinatarioId}/mensagens")
    public ResponseEntity<List<MensagemResponse>> buscar(@PathVariable long destinatarioId) {
        return ResponseEntity.ok(listarMensagensUsuario.listar(destinatarioId));
    }

    @GetMapping("me/conversas")
    public ResponseEntity<List<ConversaResponse>> listarPainel() {
        return ResponseEntity.ok(listarConversas.listar());
    }
}
