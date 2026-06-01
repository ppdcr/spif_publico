package com.spif.app.mensagem.infrastructure.persistence;

import com.spif.app.mensagem.application.ports.out.MensagemRepository;
import com.spif.app.mensagem.domain.Mensagem;
import com.spif.app.mensagem.domain.MensagemProblema;
import com.spif.app.mensagem.domain.MensagemUsuario;
import com.spif.app.mensagem.infrastructure.persistence.entity.MensagemEntity;
import com.spif.app.mensagem.infrastructure.persistence.entity.MensagemProblemaEntity;
import com.spif.app.mensagem.infrastructure.persistence.entity.MensagemUsuarioEntity;
import com.spif.app.mensagem.infrastructure.persistence.mapper.MensagemEntityMapper;
import com.spif.app.mensagem.infrastructure.persistence.repository.ConversaProjection;
import com.spif.app.mensagem.infrastructure.persistence.repository.MensagemJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MensagemRepositoryImpl implements MensagemRepository {

    private final MensagemJpaRepository repo;

    @Override
    public Mensagem salvar(Mensagem mensagem) {
        MensagemEntity entity = MensagemEntityMapper.toEntity(mensagem);

        MensagemEntity saved = repo.save(entity);
        return MensagemEntityMapper.toDomain(saved);
    }

    @Override
    public List<MensagemProblema> buscarChatIa(long alunoId, long problemaId) {
        // 1. Busca as entidades específicas do banco
        List<MensagemProblemaEntity> entities = repo.findChatIa(alunoId, problemaId);

        // 2. Mapeia cada entidade para o domínio MensagemProblema
        return entities.stream()
                .map(entity -> (MensagemProblema) MensagemEntityMapper.toDomain(entity))
                .toList();
    }

    @Override
    public List<MensagemUsuario> buscarMensagensNaoLidas(long remetenteId, long destinatarioId) {
        return repo.findNaoLidas(remetenteId, destinatarioId).stream()
                .map(m -> (MensagemUsuario) MensagemEntityMapper.toDomain(m)).toList();
    }

    @Override
    public Optional<MensagemUsuario> buscarMensagemUsuarioPorId(long mensagemId) {
        return repo.findById(mensagemId).map(m -> (MensagemUsuario) MensagemEntityMapper.toDomain(m));
    }

    @Override
    public void salvarTodas(List<MensagemUsuario> mensagens) {
        List<MensagemUsuarioEntity> entities = mensagens.stream().map(m -> (MensagemUsuarioEntity) MensagemEntityMapper.toEntity(m)).toList();
        repo.saveAll(entities);
    }

    @Override
    public List<MensagemUsuario> buscarConversaUsuario(long usuarioId, long contatoId) {
        List<MensagemUsuarioEntity> entities = repo.findConversa(usuarioId, contatoId);
        return entities.stream()
                .map(entity -> (MensagemUsuario) MensagemEntityMapper.toDomain(entity))
                .toList();
    }

    @Override
    public List<ConversaProjection> buscarPainelConversas(long usuarioId) {
        return repo.buscarPainelConversas(usuarioId);
    }
}
