package com.spif.app.percurso.nivel.web;

import com.spif.app.percurso.nivel.application.ports.in.AtualizarNivelInputPort;
import com.spif.app.percurso.nivel.application.ports.in.CriarNivelEmPercursoInputPort;
import com.spif.app.percurso.nivel.application.ports.in.DeletarNivelInputPort;
import com.spif.app.percurso.nivel.application.ports.in.ListarNiveisDoPercursoInputPort;
import com.spif.app.percurso.nivel.web.dto.in.AtualizarNivelRequest;
import com.spif.app.percurso.nivel.web.dto.in.CriarNivelRequest;
import com.spif.app.percurso.nivel.web.dto.out.NivelResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/percursos/{percursoId}/niveis")
@RequiredArgsConstructor
public class NivelController {

    private final CriarNivelEmPercursoInputPort criar;
    private final ListarNiveisDoPercursoInputPort listar;
    private final AtualizarNivelInputPort atualizar;
    private final DeletarNivelInputPort deletar;

    @PostMapping
    public ResponseEntity<NivelResponse> criar(@PathVariable long percursoId, @Valid @RequestBody CriarNivelRequest request) {
        return ResponseEntity.status(201).body(criar.criar(percursoId, request));
    }

    @GetMapping
    public ResponseEntity<List<NivelResponse>> listar(@PathVariable long percursoId) {
        return ResponseEntity.ok(listar.listarTodos(percursoId));
    }

    @PutMapping("/{nivelId}")
    public ResponseEntity<NivelResponse> atualizar(@PathVariable long percursoId, @PathVariable long nivelId, @Valid @RequestBody AtualizarNivelRequest request) {
        return ResponseEntity.ok(atualizar.atualizar(percursoId, nivelId, request));
    }

    @DeleteMapping("/{nivelId}")
    public ResponseEntity<Void> deletar(@PathVariable long percursoId, @PathVariable long nivelId) {
        deletar.deletar(percursoId, nivelId);
        return ResponseEntity.noContent().build();
    }
}
