package com.spif.app.disciplina.cursa.web;

import com.spif.app.disciplina.cursa.application.ports.in.*;
import com.spif.app.disciplina.cursa.web.dto.in.MatricularCursaRequest;
import com.spif.app.disciplina.cursa.web.dto.out.CursaResponse;
import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;
import com.spif.app.usuario.web.dto.out.UsuarioResumoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/disciplinas")
@RequiredArgsConstructor
public class CursaController {

    private final ConvidarDisciplinaInputPort convidar;
    private final AdicionarProfessorDisciplinaInputPort adicionarProfessor;
    private final AceitarConviteDisciplinaInputPort aceitar;
    private final DesmatricularDisciplinaInputPort desmatricular;
    private final ListarConvitesDisciplinaInputPort listarConvites;
    private final ListarMatriculasDisciplinaInputPort listarMatriculas;

    @PostMapping("/{disciplinaId}/alunos")
    public ResponseEntity<CursaResponse> convidar(@PathVariable long disciplinaId, @Valid @RequestBody MatricularCursaRequest request) {
        return ResponseEntity.status(201).body(convidar.convidar(disciplinaId, request));
    }

    @PostMapping("/{disciplinaId}/ministrar")
    public ResponseEntity<CursaResponse> ministrar(@PathVariable long disciplinaId) {
        return ResponseEntity.status(201).body(adicionarProfessor.adicionar(disciplinaId));
    }

    @PutMapping("/{disciplinaId}/aceitar-convite")
    public ResponseEntity<Void> aceitar(@PathVariable long disciplinaId) {
        aceitar.aceitar(disciplinaId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{disciplinaId}/usuarios/sair")
    public ResponseEntity<Void> desmatricular(@PathVariable long disciplinaId) {
        desmatricular.desmatricular(disciplinaId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{disciplinaId}/usuarios")
    public ResponseEntity<List<UsuarioResumoResponse>> listarUsuariosAtivos(@PathVariable long disciplinaId) {
        return ResponseEntity.ok(listarMatriculas.listarUsuariosAtivosPorDisciplina(disciplinaId));
    }

    @GetMapping("/{disciplinaId}/convidados")
    public ResponseEntity<List<UsuarioResumoResponse>> listarAlunosConvidados(@PathVariable long disciplinaId) {
        return ResponseEntity.ok(listarConvites.listarAlunosConvidadosPorDisciplina(disciplinaId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<DisciplinaResponse>> listarDisciplinasAtivas() {
        return ResponseEntity.ok(listarMatriculas.listarDisciplinasAtivasPorUsuario());
    }

    @GetMapping("/my/convites")
    public ResponseEntity<List<DisciplinaResponse>> listarConvitesDisciplina() {
        return ResponseEntity.ok(listarConvites.listarConvitesDisciplinasPorAluno());
    }
}
