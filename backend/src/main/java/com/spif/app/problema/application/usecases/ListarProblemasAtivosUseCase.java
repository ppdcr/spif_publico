package com.spif.app.problema.application.usecases;

import com.spif.app.problema.application.ports.in.ListarProblemasAtivosInputPort;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.web.dto.out.ProblemaResumoResponse;
import com.spif.app.problema.web.dto.in.ProblemaFiltroRequest;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarProblemasAtivosUseCase implements ListarProblemasAtivosInputPort {

    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    public Page<ProblemaResumoResponse> listarProblemas(ProblemaFiltroRequest filtro) {
        long usuarioId = AuthUtil.getUsuarioId();

        List<String> assuntos = (filtro.assuntos() != null && !filtro.assuntos().isEmpty())
                ? filtro.assuntos() : null;
        Integer qtd = (assuntos != null) ? assuntos.size() : 0;

        Pageable pageable = PageRequest.of(filtro.pagina(), filtro.tamanho());

        return problemaRepository.buscarProblemasResumidosPaginados(
                usuarioId, filtro.nivelId(), filtro.listaId(), filtro.competicaoId(), filtro.titulo(), filtro.dificuldade(), assuntos, qtd, pageable
        ).map(ProblemaResumoResponse::fromProjection);
    }
}
