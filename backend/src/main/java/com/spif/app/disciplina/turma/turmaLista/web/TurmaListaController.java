package com.spif.app.disciplina.turma.turmaLista.web;

import com.spif.app.disciplina.turma.turmaLista.application.ports.in.AdicionarListaNaTurmaInputPort;
import com.spif.app.disciplina.turma.turmaLista.application.ports.in.AtualizarListaNaTurmaInputPort;
import com.spif.app.disciplina.turma.turmaLista.application.ports.in.DeletarListaDaTurmaInputPort;
import com.spif.app.disciplina.turma.turmaLista.application.ports.in.ListarListasDaTurmaInputPort;
import com.spif.app.disciplina.turma.turmaLista.web.dto.in.AdicionarListaATurmaRequest;
import com.spif.app.disciplina.turma.turmaLista.web.dto.in.AtualizarListaTurmaRequest;
import com.spif.app.disciplina.turma.turmaLista.web.dto.out.TurmaListaResponse;
import com.spif.app.lista.web.dto.out.ListaProblemasResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/disciplinas/{disciplinaId}/turmas/{turmaId}/listas")
@RequiredArgsConstructor
public class TurmaListaController {

    private final AdicionarListaNaTurmaInputPort adicionarLista;
    private final AtualizarListaNaTurmaInputPort atualizarLista;
    private final DeletarListaDaTurmaInputPort deletarLista;
    private final ListarListasDaTurmaInputPort listarListas;

    @PostMapping
    public ResponseEntity<TurmaListaResponse> adicionar(@PathVariable long disciplinaId, @PathVariable long turmaId, @Valid @RequestBody AdicionarListaATurmaRequest request) {
        return ResponseEntity.status(201).body(adicionarLista.adicionar(disciplinaId, turmaId, request));
    }

    @PutMapping("/{listaId}")
    public ResponseEntity<TurmaListaResponse> atualizar(@PathVariable long disciplinaId, @PathVariable long turmaId, @PathVariable long listaId, @RequestBody AtualizarListaTurmaRequest request) {
        return ResponseEntity.ok(atualizarLista.atualizar(disciplinaId, turmaId, listaId, request));
    }

    @DeleteMapping("/{listaId}")
    public ResponseEntity<Void> deletar(@PathVariable long disciplinaId, @PathVariable long turmaId, @PathVariable long listaId) {
        deletarLista.deletar(disciplinaId, turmaId, listaId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ListaProblemasResponse>> listarAtivas(@PathVariable long disciplinaId, @PathVariable long turmaId) {
        return ResponseEntity.ok(listarListas.listarAtivasComProgresso(disciplinaId, turmaId));
    }

    @GetMapping("/inativas")
    public ResponseEntity<List<ListaProblemasResponse>> listarInativas(@PathVariable long disciplinaId, @PathVariable long turmaId) {
        return ResponseEntity.ok(listarListas.listarListasInativasPorTurma(disciplinaId, turmaId));
    }
}
