package com.spif.app.mensagem.application.usecases;

import com.spif.app.mensagem.application.ports.in.MarcarMensagemComoLidaInputPort;
import com.spif.app.mensagem.application.ports.out.MensagemRepository;
import com.spif.app.mensagem.domain.MensagemUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarcarMensagemComoLidaUseCase implements MarcarMensagemComoLidaInputPort {

    private final MensagemRepository mensagemRepository;

    @Override
    @Transactional
    public void marcar(long remetenteId, long destinatarioId) {
        List<MensagemUsuario> mensagensNaoLidas = mensagemRepository.buscarMensagensNaoLidas(remetenteId, destinatarioId);

        List<MensagemUsuario> lidas = mensagensNaoLidas.stream()
                .map(MensagemUsuario::ler).toList();

        mensagemRepository.salvarTodas(lidas);
    }
}
