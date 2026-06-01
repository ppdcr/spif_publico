package com.spif.app.mensagem.application.ports.out;

import com.spif.app.mensagem.domain.Mensagem;
import com.spif.app.mensagem.domain.MensagemProblema;
import com.spif.app.mensagem.domain.MensagemUsuario;
import com.spif.app.mensagem.infrastructure.persistence.repository.ConversaProjection;

import java.util.List;
import java.util.Optional;

public interface MensagemRepository {
    Mensagem salvar(Mensagem mensagem);
    List<MensagemProblema> buscarChatIa(long alunoId, long problemaId);
    List<MensagemUsuario> buscarMensagensNaoLidas(long remetenteId, long destinatarioId);
    Optional<MensagemUsuario> buscarMensagemUsuarioPorId(long mensagemId);
    void salvarTodas(List<MensagemUsuario> mensagens);
    List<MensagemUsuario> buscarConversaUsuario(long usuarioId, long contatoId);

    List<ConversaProjection> buscarPainelConversas(long usuarioId);
}
