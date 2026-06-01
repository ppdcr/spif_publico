package com.spif.app.mensagem.application.usecases;

import com.spif.app.mensagem.application.ports.in.MandarMensagemUsuarioInputPort;
import com.spif.app.mensagem.application.ports.out.MensagemRepository;
import com.spif.app.mensagem.domain.Mensagem;
import com.spif.app.mensagem.domain.MensagemUsuario;
import com.spif.app.mensagem.web.dto.in.MandarMensagemUsuarioRequest;
import com.spif.app.mensagem.web.dto.out.MensagemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MandarMensagemUsuarioUseCase implements MandarMensagemUsuarioInputPort {

    private final MensagemRepository mensagemRepository;

    @Override
    @Transactional
    public MensagemResponse executar(long remetenteId, MandarMensagemUsuarioRequest request) {
        String conteudoPai = null;

        // 1. Se houver um pai, buscamos o conteúdo dele para manter o histórico no domínio
        if (request.mensagemPaiId() != null && request.mensagemPaiId() > 0) {
            Mensagem pai = mensagemRepository.buscarMensagemUsuarioPorId(request.mensagemPaiId())
                    .orElseThrow(() -> new IllegalArgumentException("Mensagem original não encontrada."));
            conteudoPai = pai.getConteudo();
        }

        // 2. Criar o objeto de domínio usando a fábrica estática que definimos
        MensagemUsuario mensagem;
        if (conteudoPai != null) {
            mensagem = MensagemUsuario.criarResposta(
                    request.conteudo(),
                    remetenteId,
                    request.destinatarioId(),
                    request.mensagemPaiId(),
                    conteudoPai
            );
        } else {
            mensagem = MensagemUsuario.criar(
                    request.conteudo(),
                    remetenteId,
                    request.destinatarioId()
            );
        }

        Mensagem salvo = mensagemRepository.salvar(mensagem);
        return MensagemResponse.fromDomain(salvo);
    }
}
