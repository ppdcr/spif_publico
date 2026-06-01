package com.spif.app.disciplina.turma.application.usecases;

import com.spif.app.disciplina.turma.application.ports.in.BuscarTurmaInputPort;
import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.disciplina.turma.web.dto.out.TurmaResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BuscarTurmaUseCase implements BuscarTurmaInputPort {

    private final TurmaRepository turmaRepository;
    private final IngressaRepository ingressaRepository;


    @Override
    @PreAuthorize("isAuthenticated()")
    public TurmaResponse buscar(long disciplinaId, long turmaId) {
        long usuarioId = AuthUtil.getUsuarioId();

        return turmaRepository.buscarPorId(disciplinaId, turmaId).map(t -> {
            if (!ingressaRepository.existe(t.getId(), usuarioId)) {
                throw new SecurityException("Você não participa dessa turma.");
            }

            boolean isProfessor = AuthUtil.getUsuarioLogado().getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_PROFESSOR"));

            return turmaRepository.listarTurmasAtivasComProgresso(disciplinaId, usuarioId).stream()
                    .filter(tp -> tp.getId() != null && tp.getId().longValue() == t.getId())
                    .findFirst()
                    .map(tp -> {
                        TurmaResponse response = TurmaResponse.fromProjection(tp);
                        if (isProfessor) {
                            response.setPorcentagemConclusao(null);
                        }
                        return response;
                    })
                    .orElseGet(() -> {
                        TurmaResponse response = TurmaResponse.fromDomain(t);
                        if (!isProfessor) {
                            response.setPorcentagemConclusao(0.0);
                        }
                        return response;
                    });

        }).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada."));
    }
}
