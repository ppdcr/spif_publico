package com.spif.app.problema.application.usecases;

import com.spif.app.problema.application.ports.in.DeletarProblemaInputPort;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.domain.Problema;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarProblemaUseCase implements DeletarProblemaInputPort {

    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public void deletar(long id) {
        long professorId = AuthUtil.getUsuarioId();

        Problema existing = problemaRepository.buscarPorId(id).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado."));

        if (existing.getProfessorId() != professorId) {
            throw new SecurityException("Apenas o professor dono pode deletar o problema.");
        }

        problemaRepository.remover(id);
    }
}
