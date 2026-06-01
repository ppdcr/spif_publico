package com.spif.app.disciplina.cursa.application.usecases;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.cursa.application.ports.in.ListarConvitesDisciplinaInputPort;
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
public class ListarConvitesDisciplinaUseCase implements ListarConvitesDisciplinaInputPort {

    private final CursaRepository cursaRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final UsuarioRepository usuarioRepository;


    @Override
    @PreAuthorize("hasAuthority('ROLE_ALUNO')")
    public List<DisciplinaResponse> listarConvitesDisciplinasPorAluno() {
        long usuarioId = AuthUtil.getUsuarioId();

        return cursaRepository.listarConvitesDisciplinasPorAluno(usuarioId).stream()
                .map(c -> {
                    Disciplina d = disciplinaRepository.buscarPorId(c.getDisciplinaId()).get();
                    return DisciplinaResponse.fromDomain(d);
                }).toList();
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public List<UsuarioResumoResponse> listarAlunosConvidadosPorDisciplina(long disciplinaId) {
        Disciplina d = disciplinaRepository.buscarPorId(disciplinaId).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));

        return cursaRepository.listarAlunosConvidadosPorDisciplina(d.getId()).stream()
                .map(c -> {
                    Usuario u = usuarioRepository.buscarPorId(c.getUsuarioId()).get();
                    return UsuarioResumoResponse.fromDomain(u);
                }).toList();
    }
}
