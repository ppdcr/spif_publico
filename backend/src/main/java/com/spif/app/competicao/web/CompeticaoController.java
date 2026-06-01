package com.spif.app.competicao.web;

import com.spif.app.competicao.application.ports.in.AtualizarCompeticaoInputPort;
import com.spif.app.competicao.application.ports.in.CriarCompeticaoInputPort;
import com.spif.app.competicao.application.ports.in.DeletarCompeticaoInputPort;
import com.spif.app.competicao.application.ports.in.ListarCompeticoesInputPort;
import com.spif.app.competicao.web.dto.in.AtualizarCompeticaoRequest;
import com.spif.app.competicao.web.dto.in.CriarCompeticaoRequest;
import com.spif.app.competicao.web.dto.out.CompeticaoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/competicoes")
@RequiredArgsConstructor
public class CompeticaoController {

    private final CriarCompeticaoInputPort criarCompeticao;
    private final AtualizarCompeticaoInputPort atualizarCompeticao;
    private final ListarCompeticoesInputPort listarCompeticoes;
    private final DeletarCompeticaoInputPort deletarCompeticao;

    @PostMapping
    public ResponseEntity<CompeticaoResponse> adicionar(@Valid @RequestBody CriarCompeticaoRequest request) {
        return ResponseEntity.ok(criarCompeticao.criar(request));
    }

    @PutMapping("/{idCompeticao}")
    public ResponseEntity<CompeticaoResponse> atualizar(@PathVariable long idCompeticao, @RequestBody AtualizarCompeticaoRequest request) {
        return ResponseEntity.ok(atualizarCompeticao.atualizar(idCompeticao, request));
    }

    @GetMapping
    public ResponseEntity<List<CompeticaoResponse>> listarTodosAtivos() {
        return ResponseEntity.ok(listarCompeticoes.listarTodosAtivos());
    }

    @GetMapping("/inativas")
    public ResponseEntity<List<CompeticaoResponse>> listarTodosInativos() {
        return ResponseEntity.ok(listarCompeticoes.listarTodosInativos());
    }

    @DeleteMapping("/{competicaoId}")
    public ResponseEntity<Void> deletar(@PathVariable long competicaoId) {
        deletarCompeticao.deletar(competicaoId);
        return ResponseEntity.noContent().build();
    }
}