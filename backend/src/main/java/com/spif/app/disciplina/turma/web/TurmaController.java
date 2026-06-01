package com.spif.app.disciplina.turma.web;

import com.spif.app.disciplina.turma.application.ports.in.AtualizarTurmaInputPort;
import com.spif.app.disciplina.turma.application.ports.in.BuscarTurmaInputPort;
import com.spif.app.disciplina.turma.application.ports.in.CriarTurmaInputPort;
import com.spif.app.disciplina.turma.application.ports.in.DeletarTurmaInputPort;
import com.spif.app.disciplina.turma.web.dto.in.AtualizarTurmaRequest;
import com.spif.app.disciplina.turma.web.dto.in.CriarTurmaRequest;
import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/spif/v1/disciplinas/{disciplinaId}/turmas")
@RequiredArgsConstructor
public class TurmaController {

    private final CriarTurmaInputPort criarTurma;
    private final DeletarTurmaInputPort deletarTurma;
    private final AtualizarTurmaInputPort atualizarTurma;
    private final BuscarTurmaInputPort buscarTurma;

    @PostMapping
    public ResponseEntity<TurmaResponse> criar(@PathVariable long disciplinaId, @Valid @RequestBody CriarTurmaRequest request) {
        return ResponseEntity.status(201).body(criarTurma.criar(disciplinaId, request));
    }

    @PutMapping("/{turmaId}")
    public ResponseEntity<TurmaResponse> atualizar(@PathVariable long disciplinaId, @PathVariable long turmaId, @Valid @RequestBody AtualizarTurmaRequest request) {
        return ResponseEntity.ok(atualizarTurma.atualizar(disciplinaId, turmaId, request));
    }

    @DeleteMapping("/{turmaId}")
    public ResponseEntity<Void> deletar(@PathVariable long disciplinaId, @PathVariable long turmaId) {
        deletarTurma.deletar(disciplinaId, turmaId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{turmaId}")
    public ResponseEntity<TurmaResponse> buscar(@PathVariable long disciplinaId, @PathVariable long turmaId) {
        return ResponseEntity.ok(buscarTurma.buscar(disciplinaId, turmaId));
    }
}
