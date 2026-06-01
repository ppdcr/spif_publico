package com.spif.app.disciplina.turma.ingressa.web;

import com.spif.app.disciplina.turma.ingressa.application.ports.in.*;
import com.spif.app.disciplina.turma.ingressa.web.dto.in.MatricularIngressaRequest;
import com.spif.app.disciplina.turma.ingressa.web.dto.out.IngressaResponse;
import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;
import com.spif.app.usuario.web.dto.out.UsuarioResumoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/disciplinas/{disciplinaId}/turmas")
@RequiredArgsConstructor
public class IngressaController {

    private final ConvidarTurmaInputPort convidarTurma;
    private final AceitarConviteTurmaInputPort aceitarConvite;
    private final DesmatricularTurmaInputPort desmatricular;
    private final ListarConvitesTurmaInputPort listarConvites;
    private final ListarMatriculasTurmaInputPort listarMatriculas;

    @PostMapping("/{turmaId}/usuarios")
    public ResponseEntity<IngressaResponse> convidar(@PathVariable long disciplinaId, @PathVariable long turmaId, @Valid @RequestBody MatricularIngressaRequest request) {
        return ResponseEntity.status(201).body(convidarTurma.convidar(disciplinaId, turmaId, request));
    }

    @PostMapping("/aceitar-convite-qrcode")
    public ResponseEntity<IngressaResponse> aceitarConviteQrcode(
            @PathVariable long disciplinaId,
            @RequestParam String codigoConvite) {
        return ResponseEntity.status(201).body(aceitarConvite.aceitarQrcode(disciplinaId, codigoConvite));
    }

    @PutMapping("/{turmaId}/aceitar-convite")
    public ResponseEntity<Void> aceitarConvite(@PathVariable long disciplinaId, @PathVariable long turmaId) {
        aceitarConvite.aceitar(disciplinaId, turmaId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{turmaId}/usuarios/sair")
    public ResponseEntity<Void> desmatricular(@PathVariable long disciplinaId, @PathVariable long turmaId) {
        desmatricular.desmatricular(disciplinaId, turmaId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{turmaId}/usuarios")
    public ResponseEntity<List<UsuarioResumoResponse>> listarUsuariosAtivos(@PathVariable long disciplinaId, @PathVariable long turmaId) {
        return ResponseEntity.ok(listarMatriculas.listarUsuariosAtivosPorTurma(disciplinaId, turmaId));
    }

    @GetMapping("/{turmaId}/convidados")
    public ResponseEntity<List<UsuarioResumoResponse>> listarUsuariosConvidados(@PathVariable long disciplinaId, @PathVariable long turmaId) {
        return ResponseEntity.ok(listarConvites.listarUsuariosConvidadosPorTurma(disciplinaId, turmaId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TurmaResponse>> listarTurmasAtivas(@PathVariable long disciplinaId) {
        return ResponseEntity.ok(listarMatriculas.listarTurmasAtivasPorUsuario(disciplinaId));
    }

    @GetMapping("/my/convites")
    public ResponseEntity<List<TurmaResponse>> listarConvitesTurma(@PathVariable long disciplinaId) {
        return ResponseEntity.ok(listarConvites.listarConvitesTurmaPorUsuario(disciplinaId));
    }
}
