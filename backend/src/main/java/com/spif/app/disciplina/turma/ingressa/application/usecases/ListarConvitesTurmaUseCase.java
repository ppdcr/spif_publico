package com.spif.app.disciplina.turma.ingressa.application.usecases;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.ingressa.application.ports.in.ListarConvitesTurmaInputPort;
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
public class ListarConvitesTurmaUseCase implements ListarConvitesTurmaInputPort {

    private final TurmaRepository turmaRepository;
    private final IngressaRepository ingressaRepository;
    private final UsuarioRepository usuarioRepository;
    private final DisciplinaRepository disciplinaRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<TurmaResponse> listarConvitesTurmaPorUsuario(long disciplinaId) {
        long usuarioId = AuthUtil.getUsuarioId();
        Disciplina d = disciplinaRepository.buscarPorId(disciplinaId).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));

        return ingressaRepository.listarConvitesTurmaPorUsuario(usuarioId).stream()
                .map(i -> {
                    Turma t = turmaRepository.buscarPorId(d.getId(), i.getTurmaId()).get();
                    return TurmaResponse.fromDomain(t);
                }).toList();
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public List<UsuarioResumoResponse> listarUsuariosConvidadosPorTurma(long disciplinaId, long turmaId) {
        Turma t = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));

        return ingressaRepository.listarUsuariosConvidadosPorTurma(t.getId()).stream()
                .map(i -> {
                    Usuario u = usuarioRepository.buscarPorId(i.getUsuarioId()).get();
                    return UsuarioResumoResponse.fromDomain(u);
                }).toList();
    }
}
