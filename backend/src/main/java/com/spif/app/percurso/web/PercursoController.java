package com.spif.app.percurso.web;

import com.spif.app.percurso.application.ports.in.AtualizarPercursoInputPort;
import com.spif.app.percurso.application.ports.in.CriarPercursoInputPort;
import com.spif.app.percurso.application.ports.in.DeletarPercursoInputPort;
import com.spif.app.percurso.application.ports.in.ListarPercursoInputPort;
import com.spif.app.percurso.web.dto.in.AtualizarPercursoRequest;
import com.spif.app.percurso.web.dto.in.CriarPercursoRequest;
import com.spif.app.percurso.web.dto.out.PercursoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/percursos")
@RequiredArgsConstructor
public class PercursoController {

    private final CriarPercursoInputPort criar;
    private final ListarPercursoInputPort listar;
    private final AtualizarPercursoInputPort atualizar;
    private final DeletarPercursoInputPort deletar;

    @PostMapping
    public ResponseEntity<PercursoResponse> adicionar(@Valid @RequestBody CriarPercursoRequest request) {
        return ResponseEntity.ok(criar.criar(request));
    }

    @PutMapping("/{percursoId}")
    public ResponseEntity<PercursoResponse> atualizar(@PathVariable long percursoId, @Valid @RequestBody AtualizarPercursoRequest request) {
        return ResponseEntity.ok(atualizar.atualizar(percursoId, request));
    }

    @DeleteMapping("/{percursoId}")
    public ResponseEntity<Void> deletar(@PathVariable long percursoId) {
        deletar.deletar(percursoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PercursoResponse>> listarTodos() {
        return ResponseEntity.ok(listar.listarTodos());
    }
}
