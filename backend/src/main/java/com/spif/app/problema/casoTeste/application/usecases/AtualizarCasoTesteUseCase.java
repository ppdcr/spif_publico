package com.spif.app.problema.casoTeste.application.usecases;

import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.casoTeste.application.ports.in.AtualizarCasoTesteInputPort;
import com.spif.app.problema.casoTeste.application.ports.out.CasoTesteRepository;
import com.spif.app.problema.casoTeste.domain.CasoTeste;
import com.spif.app.problema.casoTeste.web.dto.in.AtualizarCasoTesteRequest;
import com.spif.app.problema.casoTeste.web.dto.out.CasoTesteResponse;
import com.spif.app.problema.domain.Problema;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarCasoTesteUseCase implements AtualizarCasoTesteInputPort {

    private final CasoTesteRepository casoTesteRepository;
    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public CasoTesteResponse atualizar(long problemaId, long casoId, AtualizarCasoTesteRequest request) {
        Long professorId = AuthUtil.getUsuarioId();

        CasoTeste existente = casoTesteRepository.buscarPorId(problemaId, casoId).orElseThrow(() -> new IllegalArgumentException("Caso de teste não encontrado neste problema."));
        Problema problema = problemaRepository.buscarPorId(existente.getProblemaId()).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado"));

        if (problema.getProfessorId() != professorId) {
            throw new SecurityException("Apenas o professor dono pode atualizar casos de teste");
        }

        CasoTeste updated = existente.atualizar(request.entrada(), request.saida(), request.visivel(), request.ordem());

        CasoTeste saved = casoTesteRepository.salvar(updated);
        return CasoTesteResponse.fromDomain(saved);
    }
}
