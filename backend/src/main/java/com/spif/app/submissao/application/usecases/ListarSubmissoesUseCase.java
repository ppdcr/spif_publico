package com.spif.app.submissao.application.usecases;

import com.spif.app.shared.security.AuthUtil;
import com.spif.app.submissao.application.ports.in.ListarSubmissoesInputPort;
import com.spif.app.submissao.application.ports.out.SubmissaoRepository;
import com.spif.app.submissao.web.dto.out.SubmissaoResumoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarSubmissoesUseCase implements ListarSubmissoesInputPort {

    private final SubmissaoRepository submissaoRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_ALUNO')")
    public List<SubmissaoResumoResponse> listarTodos(long problemaId) {
        long alunoId = AuthUtil.getUsuarioId();
        return submissaoRepository.listarPorProblemaEAluno(problemaId, alunoId).stream().map(SubmissaoResumoResponse::fromDomain).toList();
    }
}
