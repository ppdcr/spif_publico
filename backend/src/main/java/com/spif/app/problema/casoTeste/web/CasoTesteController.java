package com.spif.app.problema.casoTeste.web;

import com.spif.app.problema.casoTeste.application.ports.in.AtualizarCasoTesteInputPort;
import com.spif.app.problema.casoTeste.application.ports.in.CriarCasoTesteInputPort;
import com.spif.app.problema.casoTeste.application.ports.in.DeletarCasoTesteInputPort;
import com.spif.app.problema.casoTeste.application.ports.in.ListarCasosProblemaInputPort;
import com.spif.app.problema.casoTeste.web.dto.in.AtualizarCasoTesteRequest;
import com.spif.app.problema.casoTeste.web.dto.in.CriarCasoTesteRequest;
import com.spif.app.problema.casoTeste.web.dto.out.CasoTesteResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/problemas/{problemaId}/casos")
@RequiredArgsConstructor
public class CasoTesteController {

    private final CriarCasoTesteInputPort criarCasoTeste;
    private final AtualizarCasoTesteInputPort atualizarCasoTeste;
    private final DeletarCasoTesteInputPort deletarCasoTeste;
    private final ListarCasosProblemaInputPort listarCasosProblema;

    @PostMapping
    public ResponseEntity<CasoTesteResponse> criar(@PathVariable long problemaId, @Valid @RequestBody CriarCasoTesteRequest request) {
        return ResponseEntity.status(201).body(criarCasoTeste.criar(problemaId, request));
    }

    @PutMapping("/{casoId}")
    public ResponseEntity<CasoTesteResponse> atualizar(@PathVariable long problemaId, @PathVariable long casoId, @RequestBody AtualizarCasoTesteRequest request) {
        return ResponseEntity.ok(atualizarCasoTeste.atualizar(problemaId, casoId, request));
    }

    @DeleteMapping("/{casoId}")
    public ResponseEntity<Void> deletar(@PathVariable long problemaId, @PathVariable long casoId) {
        deletarCasoTeste.deletar(problemaId, casoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CasoTesteResponse>> listarCasos(@PathVariable long problemaId) {
        return ResponseEntity.ok(listarCasosProblema.listarTodos(problemaId));
    }
}
