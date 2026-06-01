package com.spif.app.mensagem.application.usecases;

import com.spif.app.mensagem.application.ports.in.ListarMensagensProblemaInputPort;
import com.spif.app.mensagem.application.ports.out.MensagemRepository;
import com.spif.app.mensagem.web.dto.out.MensagemResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarMensagensProblemaUseCase implements ListarMensagensProblemaInputPort {

    private final MensagemRepository mensagemRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_ALUNO')")
    public List<MensagemResponse> buscar(long problemaId) {
        long alunoId = AuthUtil.getUsuarioId();
        return mensagemRepository.buscarChatIa(alunoId, problemaId).stream().map(MensagemResponse::fromDomain).toList();
    }
}
