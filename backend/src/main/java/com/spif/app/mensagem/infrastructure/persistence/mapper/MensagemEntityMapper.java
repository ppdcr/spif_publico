package com.spif.app.mensagem.infrastructure.persistence.mapper;

import com.spif.app.mensagem.domain.Mensagem;
import com.spif.app.mensagem.domain.MensagemProblema;
import com.spif.app.mensagem.domain.MensagemUsuario;
import com.spif.app.mensagem.infrastructure.persistence.entity.MensagemEntity;
import com.spif.app.mensagem.infrastructure.persistence.entity.MensagemProblemaEntity;
import com.spif.app.mensagem.infrastructure.persistence.entity.MensagemUsuarioEntity;

public class MensagemEntityMapper {
    public static Mensagem toDomain(MensagemEntity e) {
        return switch (e) {
            case null -> null;
            case MensagemUsuarioEntity u -> new MensagemUsuario(u.getId(), u.getConteudo(), u.getHorarioEnviada(), u.getRemetenteId(), u.getRole(), u.getDestinatarioId(), u.getMensagemPaiId(), u.getConteudoMensagemPai(), u.getHorarioLida());
            case MensagemProblemaEntity p -> new MensagemProblema(p.getId(), p.getConteudo(), p.getHorarioEnviada(), p.getRemetenteId(), p.getRole(), p.getProblemaId(), p.getRemetente());
            default -> throw new IllegalArgumentException("Tipo de mensagem inválido.");
        };
    }

    public static MensagemEntity toEntity(Mensagem d) {
        return switch (d) {
            case null -> null;
            case MensagemUsuario u -> {
                MensagemUsuarioEntity e = new MensagemUsuarioEntity();
                e.setId(d.getId());
                e.setConteudo(d.getConteudo());
                e.setHorarioEnviada(d.getHorarioEnviada());
                e.setRemetenteId(d.getRemetenteId());
                e.setRole(d.getRole());
                e.setDestinatarioId(u.getDestinatarioId());
                e.setMensagemPaiId(u.getMensagemPaiId());
                e.setConteudoMensagemPai(u.getConteudoMensagemPai());
                e.setHorarioLida(u.getHorarioLida());
                yield e;
            }
            case MensagemProblema p -> {
                MensagemProblemaEntity e = new MensagemProblemaEntity();
                e.setId(p.getId());
                e.setConteudo(p.getConteudo());
                e.setHorarioEnviada(p.getHorarioEnviada());
                e.setRemetenteId(p.getRemetenteId());
                e.setRole(p.getRole());
                e.setProblemaId(p.getProblemaId());
                e.setRemetente(p.getRemetente());
                yield e;
            }
            default -> throw new IllegalArgumentException("Tipo de mensagem inválido.");
        };
    }
}
