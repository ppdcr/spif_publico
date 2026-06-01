package com.spif.app.mensagem.web;

import com.spif.app.mensagem.application.ports.in.ListarMensagensProblemaInputPort;
import com.spif.app.mensagem.application.ports.in.MandarMensagemProblemaInputPort;
import com.spif.app.mensagem.web.dto.in.MandarMensagemProblemaRequest;
import com.spif.app.mensagem.web.dto.out.MensagemResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/problemas/{problemaId}/mensagens")
@RequiredArgsConstructor
public class MensagemProblemaController {
    private final MandarMensagemProblemaInputPort mandarMensagemProblema;
    private final ListarMensagensProblemaInputPort listarMensagensProblema;

    @PostMapping
    public ResponseEntity<MensagemResponse> perguntar(@PathVariable long problemaId, @Valid @RequestBody MandarMensagemProblemaRequest request) {
        return ResponseEntity.status(201).body(mandarMensagemProblema.enviarPergunta(problemaId, request));
    }

    @GetMapping
    public ResponseEntity<List<MensagemResponse>> listar(@PathVariable long problemaId) {
        return ResponseEntity.ok(listarMensagensProblema.buscar(problemaId));
    }
}
