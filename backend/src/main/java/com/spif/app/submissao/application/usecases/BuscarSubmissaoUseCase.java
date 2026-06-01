package com.spif.app.submissao.application.usecases;

import com.spif.app.submissao.application.ports.in.BuscarSubmissaoInputPort;
import com.spif.app.submissao.application.ports.out.SubmissaoRepository;
import com.spif.app.submissao.domain.Submissao;
import com.spif.app.submissao.resultado.domain.Resultado;
import com.spif.app.submissao.resultado.repository.ResultadoRepository;
import com.spif.app.submissao.web.dto.out.SubmissaoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuscarSubmissaoUseCase implements BuscarSubmissaoInputPort {

    private final SubmissaoRepository submissaoRepository;
    private final ResultadoRepository resultadoRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_ALUNO')")
    public SubmissaoResponse buscar(long submissaoId) {
        Submissao submissao = submissaoRepository.buscarPorId(submissaoId)
                .orElseThrow(() -> new IllegalArgumentException("Submissao não encontrada."));

        List<Resultado> resultados = resultadoRepository.buscarPorSubmissao(submissao.getId());

        SubmissaoResponse response = SubmissaoResponse.fromDomain(submissao);
        response.setResultados(resultados);
        return response;
    }
}
