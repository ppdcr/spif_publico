package com.spif.app.lista.web;

import com.spif.app.lista.application.ports.in.*;
import com.spif.app.lista.web.dto.in.AtualizarListaProblemasRequest;
import com.spif.app.lista.web.dto.in.CriarListaProblemasRequest;
import com.spif.app.lista.web.dto.out.ListaProblemasResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/listas")
@RequiredArgsConstructor
public class ListaProblemasController {

    private final CriarListaProblemasInputPort criarLista;
    private final AtualizarListaProblemasInputPort atualizarLista;
    private final DeletarListaProblemasInputPort deletarLista;
    private final ListarListasProfessorInputPort listarProfessor;
    private final BuscarListaInputPort buscarLista;

    @PostMapping
    public ResponseEntity<ListaProblemasResponse> criarListaProblemas(@Valid @RequestBody CriarListaProblemasRequest request) {
        return ResponseEntity.status(201).body(criarLista.criarListaProblemas(request));
    }

    @PutMapping("/{listaId}")
    public ResponseEntity<ListaProblemasResponse> atualizarListaProblemas(@PathVariable long listaId, @RequestBody AtualizarListaProblemasRequest request) {
        return ResponseEntity.ok(atualizarLista.atualizarListaProblemas(listaId, request));
    }

    @DeleteMapping("/{listaId}")
    public ResponseEntity<Void> deletarListaProblemas(@PathVariable long listaId) {
        deletarLista.deletarListaProblemas(listaId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<List<ListaProblemasResponse>> listarPorProfessor(@RequestParam(required = false) String titulo) {
        return ResponseEntity.ok(listarProfessor.listarListasProfessor(titulo));
    }

    @GetMapping("/{listaId}")
    public ResponseEntity<ListaProblemasResponse> buscar(@PathVariable long listaId, @RequestParam(required = false) Long turmaId) {
        return ResponseEntity.ok(buscarLista.buscar(listaId, turmaId));
    }
}
