package com.spif.app.lista.itemLista.web;

import com.spif.app.lista.itemLista.application.ports.in.AdicionarProblemaAListaInputPort;
import com.spif.app.lista.itemLista.application.ports.in.DeletarProblemaDaListaInputPort;
import com.spif.app.lista.itemLista.web.dto.in.AdicionarProblemaAListaRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/spif/v1/listas/{listaId}/problemas")
@RequiredArgsConstructor
public class ItemListaController {

    private final AdicionarProblemaAListaInputPort adicionar;
    private final DeletarProblemaDaListaInputPort deletar;

    @PostMapping
    public ResponseEntity<Void> criar(
            @PathVariable long listaId,
            @Valid @RequestBody AdicionarProblemaAListaRequest request) {

        adicionar.criar(listaId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{problemaId}")
    public ResponseEntity<Void> deletar(
            @PathVariable long listaId,
            @PathVariable long problemaId) {

        deletar.deletar(listaId, problemaId);
        return ResponseEntity.noContent().build();
    }
}
