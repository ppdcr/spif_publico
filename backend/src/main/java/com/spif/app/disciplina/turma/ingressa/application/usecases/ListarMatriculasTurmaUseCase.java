package com.spif.app.disciplina.turma.ingressa.application.usecases;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.ingressa.application.ports.in.ListarMatriculasTurmaInputPort;
import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;
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
public class ListarMatriculasTurmaUseCase implements ListarMatriculasTurmaInputPort {

    private final TurmaRepository turmaRepository;
    private final IngressaRepository ingressaRepository;
    private final UsuarioRepository usuarioRepository;
    private final DisciplinaRepository disciplinaRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<TurmaResponse> listarTurmasAtivasPorUsuario(long disciplinaId) {
        long usuarioId = AuthUtil.getUsuarioId();
        Disciplina d = disciplinaRepository.buscarPorId(disciplinaId).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));

        boolean isProfessor = AuthUtil.getUsuarioLogado().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PROFESSOR"));

        return turmaRepository.listarTurmasAtivasComProgresso(d.getId(), usuarioId).stream()
                .map(tp -> {
                    TurmaResponse response = TurmaResponse.fromProjection(tp);
                    if (isProfessor) response.setPorcentagemConclusao(null);
                    return response;
                }).toList();
    }

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<UsuarioResumoResponse> listarUsuariosAtivosPorTurma(long disciplinaId, long turmaId) {
        Turma t = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));

        return ingressaRepository.listarUsuariosAtivosPorTurma(t.getId()).stream()
                .map(i -> {
                    Usuario u = usuarioRepository.buscarPorId(i.getUsuarioId()).orElseThrow(() -> new IllegalArgumentException("Usuãrio não encontrado."));;
                    return UsuarioResumoResponse.fromDomain(u);
                }).toList();
    }
}
