package com.spif.app.problema.casoTeste.application.usecases;

import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.casoTeste.application.ports.in.DeletarCasoTesteInputPort;
import com.spif.app.problema.casoTeste.application.ports.out.CasoTesteRepository;
import com.spif.app.problema.casoTeste.domain.CasoTeste;
import com.spif.app.problema.domain.Problema;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeletarCasoTesteUseCase implements DeletarCasoTesteInputPort {

    private final CasoTesteRepository casoTesteRepository;
    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public void deletar(long problemaId, long casoId) {
        long professorId = AuthUtil.getUsuarioId();

        CasoTeste existente = casoTesteRepository.buscarPorId(problemaId, casoId).orElseThrow(() -> new IllegalArgumentException("Caso de teste não encontrado neste paroblema."));

        Problema problema = problemaRepository.buscarPorId(existente.getProblemaId()).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado."));

        if (problema.getProfessorId() != professorId) {
            throw new SecurityException("Apenas o professor dono pode remover casos de teste");
        }

        casoTesteRepository.remover(casoId);
    }
}
