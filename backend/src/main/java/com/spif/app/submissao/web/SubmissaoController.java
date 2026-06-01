package com.spif.app.submissao.web;

import com.spif.app.submissao.application.ports.in.BuscarSubmissaoInputPort;
import com.spif.app.submissao.application.ports.in.CriarSubmissaoInputPort;
import com.spif.app.submissao.application.ports.in.ListarSubmissoesInputPort;
import com.spif.app.submissao.web.dto.in.CriarSubmissaoRequest;
import com.spif.app.submissao.web.dto.out.SubmissaoResponse;
import com.spif.app.submissao.web.dto.out.SubmissaoResumoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/problemas/{problemaId}")
@RequiredArgsConstructor
public class SubmissaoController {

    private final CriarSubmissaoInputPort criarSubmissao;
    private final BuscarSubmissaoInputPort buscarSubmissao;
    private final ListarSubmissoesInputPort listarSubmissoes;

    @PostMapping("/submissoes")
    public ResponseEntity<SubmissaoResumoResponse> criar(@PathVariable long problemaId, @Valid @RequestBody CriarSubmissaoRequest request) {
        return ResponseEntity.status(201).body(criarSubmissao.criar(problemaId, request));
    }

    @GetMapping("/submissoes")
    public ResponseEntity<List<SubmissaoResumoResponse>> listar(@PathVariable long problemaId) {
        return ResponseEntity.ok(listarSubmissoes.listarTodos(problemaId));
    }

    @GetMapping("/submissoes/{submissaoId}")
    public ResponseEntity<SubmissaoResponse> buscar(@PathVariable long submissaoId) {
        return ResponseEntity.ok(buscarSubmissao.buscar(submissaoId));
    }
}
