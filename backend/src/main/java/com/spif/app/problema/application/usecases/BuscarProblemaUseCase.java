package com.spif.app.problema.application.usecases;

import com.spif.app.problema.application.ports.in.BuscarProblemaInputPort;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.casoTeste.application.ports.out.CasoTesteRepository;
import com.spif.app.problema.casoTeste.web.dto.out.CasoTesteResponse;
import com.spif.app.problema.domain.Problema;
import com.spif.app.problema.web.dto.out.ProblemaResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuscarProblemaUseCase implements BuscarProblemaInputPort {

    private final ProblemaRepository problemaRepository;
    private final CasoTesteRepository casoTesteRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public ProblemaResponse buscarPorId(Long id) {
        Problema problema = problemaRepository.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Problema não encontrado."));

        long usuarioId = AuthUtil.getUsuarioId();
        if (!problema.isVisivel() && problema.getProfessorId() != usuarioId) {
            throw new IllegalArgumentException("Problema não encontrado.");
        }

        List<CasoTesteResponse> casosVisiveis = casoTesteRepository.listarVisiveisPorProblema(problema.getId())
                .stream()
                .map(CasoTesteResponse::fromDomain)
                .toList();

        ProblemaResponse response = ProblemaResponse.fromDomain(problema);
        response.setCasosVisiveis(casosVisiveis);
        return response;
    }
}
