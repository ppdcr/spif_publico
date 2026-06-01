package com.spif.app.problema.web;

import com.spif.app.problema.application.ports.in.*;
import com.spif.app.problema.web.dto.in.AtualizarProblemaRequest;
import com.spif.app.problema.web.dto.in.CriarProblemaRequest;
import com.spif.app.problema.web.dto.out.ProblemaResponse;
import com.spif.app.problema.web.dto.out.ProblemaResumoResponse;
import com.spif.app.problema.web.dto.in.ProblemaFiltroRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/problemas")
@RequiredArgsConstructor
public class ProblemaController {

    private final CriarProblemaInputPort criarProblema;
    private final BuscarProblemaInputPort buscarProblema;
    private final ListarProblemasAtivosInputPort listarProblemas;
    private final ListarProblemasProfessorInputPort listarProblemasProfessor;
    private final AtualizarProblemaInputPort atualizarProblema;
    private final DeletarProblemaInputPort deletarProblema;

    @PostMapping
    public ResponseEntity<ProblemaResponse> criar(@Valid @RequestBody CriarProblemaRequest request) {
        return ResponseEntity.status(201).body(criarProblema.criar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemaResponse> buscar(@PathVariable long id) {
        return ResponseEntity.ok(buscarProblema.buscarPorId(id));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ProblemaResumoResponse>> listarAtivosPorProfessor() {
        return ResponseEntity.ok(listarProblemasProfessor.listarProblemasAtivosProfessor());
    }

    @GetMapping("/me/inativos")
    public ResponseEntity<List<ProblemaResumoResponse>> listarInativosPorProfessor() {
        return ResponseEntity.ok(listarProblemasProfessor.listarProblemasInativosProfessor());
    }

    @GetMapping
    public ResponseEntity<Page<ProblemaResumoResponse>> listar(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) Integer dificuldade,
            @RequestParam(required = false) List<String> assuntos,
            @RequestParam(required = false) Long nivelId,
            @RequestParam(required = false) Long competicaoId,
            @RequestParam(required = false) Long listaId,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamanho) {

        ProblemaFiltroRequest filtro = new ProblemaFiltroRequest(titulo, dificuldade, assuntos, pagina, tamanho, nivelId, competicaoId, listaId);
        return ResponseEntity.ok(listarProblemas.listarProblemas(filtro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProblemaResponse> atualizar(@PathVariable long id, @RequestBody AtualizarProblemaRequest request) {
        return ResponseEntity.ok(atualizarProblema.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable long id) {
        deletarProblema.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
