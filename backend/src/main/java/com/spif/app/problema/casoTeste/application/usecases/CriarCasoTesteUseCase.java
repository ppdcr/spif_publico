package com.spif.app.problema.casoTeste.application.usecases;

import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.casoTeste.application.ports.in.CriarCasoTesteInputPort;
import com.spif.app.problema.casoTeste.application.ports.out.CasoTesteRepository;
import com.spif.app.problema.casoTeste.domain.CasoTeste;
import com.spif.app.problema.casoTeste.web.dto.in.CriarCasoTesteRequest;
import com.spif.app.problema.casoTeste.web.dto.out.CasoTesteResponse;
import com.spif.app.problema.domain.Problema;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CriarCasoTesteUseCase implements CriarCasoTesteInputPort {

    private final CasoTesteRepository casoTesteRepository;
    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public CasoTesteResponse criar(long problemaId, CriarCasoTesteRequest request) {
        Long professorId = AuthUtil.getUsuarioId();

        Problema problema = problemaRepository.buscarPorId(problemaId).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado"));

        if (problema.getProfessorId() != professorId) {
            throw new SecurityException("Apenas o professor dono pode adicionar casos de teste");
        }

        CasoTeste c = CasoTeste.criar(problema.getId(), request.entrada(), request.saida(), request.visivel(), request.ordem());

        CasoTeste saved = casoTesteRepository.salvar(c);
        return CasoTesteResponse.fromDomain(saved);
    }
}
