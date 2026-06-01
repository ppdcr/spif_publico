package com.spif.app.percurso.nivel.contem.web;

import com.spif.app.percurso.nivel.contem.application.ports.in.AdicionarProblemaAoNivelInputPort;
import com.spif.app.percurso.nivel.contem.application.ports.in.DeletarProblemaDoNivelInputPort;
import com.spif.app.percurso.nivel.contem.web.dto.in.AdicionarProblemaAoNivelRequest;
import com.spif.app.percurso.nivel.contem.web.dto.out.ContemResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/spif/v1/percursos/{percursoId}/niveis/{nivelId}/problemas")
@RequiredArgsConstructor
public class ContemController {

    private final AdicionarProblemaAoNivelInputPort adicionar;
    private final DeletarProblemaDoNivelInputPort deletar;

    @PostMapping
    public ResponseEntity<ContemResponse> criar(
            @PathVariable long percursoId,
            @PathVariable long nivelId,
            @Valid @RequestBody AdicionarProblemaAoNivelRequest request) {

        return ResponseEntity.status(201).body(adicionar.criar(percursoId, nivelId, request));
    }

    @DeleteMapping("/{problemaId}")
    public ResponseEntity<Void> deletar(
            @PathVariable long percursoId,
            @PathVariable long nivelId,
            @PathVariable long problemaId) {

        deletar.deletar(percursoId, nivelId, problemaId);
        return ResponseEntity.noContent().build();
    }
}
