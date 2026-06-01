package com.spif.app.problema.casoTeste.application.usecases;

import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.casoTeste.application.ports.in.ListarCasosProblemaInputPort;
import com.spif.app.problema.casoTeste.application.ports.out.CasoTesteRepository;
import com.spif.app.problema.casoTeste.web.dto.out.CasoTesteResponse;
import com.spif.app.problema.domain.Problema;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarCasosProblemaUseCase implements ListarCasosProblemaInputPort {

    private final CasoTesteRepository casoTesteRepository;
    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public List<CasoTesteResponse> listarTodos(long problemaId) {
        Problema problema = problemaRepository.buscarPorId(problemaId).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado."));

        long professorId = AuthUtil.getUsuarioId();
        if (problema.getProfessorId() != professorId) {
            throw new SecurityException("Você não é o dono desse problema.");
        }

        return casoTesteRepository.listarPorProblemaOrdenado(problemaId).stream().map(c -> {
            CasoTesteResponse r = CasoTesteResponse.fromDomain(c);
            r.setVisivel(c.isVisivel());
            return r;
        }).toList();
    }
}
