package com.spif.app.disciplina.web;

import com.spif.app.disciplina.application.ports.in.*;
import com.spif.app.disciplina.web.dto.in.AtualizarDisciplinaRequest;
import com.spif.app.disciplina.web.dto.in.CriarDisciplinaRequest;
import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/disciplinas")
@RequiredArgsConstructor
public class DisciplinaController {

    private final CriarDisciplinaInputPort criarDisciplina;
    private final AtualizarDisciplinaInputPort atualizarDisciplina;
    private final DeletarDisciplinaInputPort deletarDisciplina;
    private final ListarDisciplinasInputPort listarDisciplinas;
    private final BuscarDisciplinaInputPort buscarDisciplina;

    @PostMapping
    public ResponseEntity<DisciplinaResponse> criar(@Valid @RequestBody CriarDisciplinaRequest request) {
        return ResponseEntity.ok(criarDisciplina.criar(request));
    }

    @PutMapping("/{disciplinaId}")
    public ResponseEntity<DisciplinaResponse> atualizar(@PathVariable long disciplinaId, @RequestBody AtualizarDisciplinaRequest request) {
        return ResponseEntity.ok(atualizarDisciplina.atualizar(disciplinaId, request));
    }

    @DeleteMapping("/{disciplinaId}")
    public ResponseEntity<Void> deletar(@PathVariable long disciplinaId) {
        deletarDisciplina.deletar(disciplinaId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<DisciplinaResponse>> listarTodas() {
        return ResponseEntity.ok(listarDisciplinas.listarTodas());
    }

    @GetMapping("/{disciplinaId}")
    public ResponseEntity<DisciplinaResponse> buscar(@PathVariable long disciplinaId) {
        return ResponseEntity.ok(buscarDisciplina.buscar(disciplinaId));
    }
}