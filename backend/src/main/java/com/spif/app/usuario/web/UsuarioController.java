package com.spif.app.usuario.web;

import com.spif.app.usuario.application.ports.in.*;
import com.spif.app.usuario.refreshToken.web.dto.in.RefreshRequest;
import com.spif.app.usuario.web.dto.in.AtualizarUsuarioRequest;
import com.spif.app.usuario.web.dto.in.AuthRequest;
import com.spif.app.usuario.web.dto.in.CriarUsuarioRequest;
import com.spif.app.usuario.web.dto.out.AuthResponse;
import com.spif.app.usuario.web.dto.out.RankingResponse;
import com.spif.app.usuario.web.dto.out.UsuarioResponse;
import com.spif.app.usuario.web.dto.out.UsuarioResumoResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spif/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final CriarUsuarioInputPort criarUsuario;
    private final BuscarUsuarioInputPort buscarUsuario;
    private final AutenticarUsuarioInputPort autenticarUsuario;
    private final AtualizarUsuarioInputPort atualizarUsuario;
    private final ElogiarProfessorInputPort elogiarProfessor;
    private final ListarUsuariosInputPort listarUsuarios;
    private final ListarRankingInputPort listarRanking;

    @PostMapping("/auth/cadastrar")
    public ResponseEntity<AuthResponse> criar(@Valid @RequestBody CriarUsuarioRequest request) {
        return ResponseEntity.status(201).body(criarUsuario.criar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscar(@PathVariable long id) {
        return ResponseEntity.ok(buscarUsuario.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResumoResponse>> listarPorNome(@RequestParam @NotBlank(message = "O termo de busca não pode estar vazio") String nome) {
        return ResponseEntity.ok(listarUsuarios.listarPorNome(nome.trim()));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> autenticar(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(autenticarUsuario.autenticar(request));
    }

    @PutMapping("/me/atualizar-dados")
    public ResponseEntity<UsuarioResponse> atualizar(@RequestBody AtualizarUsuarioRequest request) {
        return ResponseEntity.ok(atualizarUsuario.atualizar(request));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(autenticarUsuario.atualizarToken(request));
    }

    @PutMapping("/{professorId}/elogiar")
    public ResponseEntity<Void> elogar(@PathVariable long professorId) {
        elogiarProfessor.elogiar(professorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ranking")
    public ResponseEntity<RankingResponse> listarRanking() {
        return ResponseEntity.ok(listarRanking.listarRanking());
    }
}