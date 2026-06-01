package com.spif.app.competicao.participacao.web;

import com.spif.app.competicao.participacao.application.ports.in.AdicionarProblemaEmCompeticaoInputPort;
import com.spif.app.competicao.participacao.application.ports.in.DeletarProblemaDeCompeticaoInputPort;
import com.spif.app.competicao.participacao.web.dto.in.AdicionarProblemaEmCompeticaoRequest;
import com.spif.app.competicao.participacao.web.dto.out.ParticipacaoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/spif/v1/competicoes/{competicaoId}/problemas")
@RequiredArgsConstructor
public class ParticipacaoController {

    private final AdicionarProblemaEmCompeticaoInputPort adicionar;
    private final DeletarProblemaDeCompeticaoInputPort remover;

    @PostMapping
    public ResponseEntity<ParticipacaoResponse> adicionar(@PathVariable long competicaoId, @Valid @RequestBody AdicionarProblemaEmCompeticaoRequest request) {
        return ResponseEntity.ok(adicionar.adicionar(competicaoId, request));
    }

    @DeleteMapping("/{problemaId}")
    public ResponseEntity<Void> remover(@PathVariable long competicaoId, @PathVariable long problemaId) {
        remover.deletar(competicaoId, problemaId);
        return ResponseEntity.noContent().build();
    }
}
