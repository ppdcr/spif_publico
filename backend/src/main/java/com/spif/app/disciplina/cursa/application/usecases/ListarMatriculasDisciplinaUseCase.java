package com.spif.app.disciplina.cursa.application.usecases;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.cursa.application.ports.in.ListarMatriculasDisciplinaInputPort;
import com.spif.app.disciplina.cursa.application.ports.out.CursaRepository;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.disciplina.web.dto.out.DisciplinaResponse;
import com.spif.app.shared.security.AuthUtil;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Usuario;
import com.spif.app.usuario.web.dto.out.UsuarioResumoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarMatriculasDisciplinaUseCase implements ListarMatriculasDisciplinaInputPort {

    private final DisciplinaRepository disciplinaRepository;
    private final CursaRepository cursaRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<DisciplinaResponse> listarDisciplinasAtivasPorUsuario() {
        long usuarioId = AuthUtil.getUsuarioId();
        return cursaRepository.listarDisciplinasAtivasPorUsuario(usuarioId).stream()
                .map(c -> {
                    Disciplina d = disciplinaRepository.buscarPorId(c.getDisciplinaId()).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));
                    return DisciplinaResponse.fromDomain(d);
                }).toList();
    }

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<UsuarioResumoResponse> listarUsuariosAtivosPorDisciplina(long disciplinaId) {
        Disciplina d = disciplinaRepository.buscarPorId(disciplinaId).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));

        return cursaRepository.listarUsuariosAtivosPorDisciplina(d.getId()).stream()
                .map(c -> {
                    Usuario u = usuarioRepository.buscarPorId(c.getUsuarioId()).orElseThrow(() -> new IllegalArgumentException("Usuãrio não encontrado."));
                    return UsuarioResumoResponse.fromDomain(u);
                }).toList();
    }
}
