package com.spif.app.submissao.infrastructure.persistence.mapper;

import com.spif.app.submissao.domain.Submissao;
import com.spif.app.submissao.infrastructure.persistence.entity.SubmissaoEntity;

public class SubmissaoEntityMapper {
    public static Submissao toDomain(SubmissaoEntity e) {
        if (e == null) return null;

        return new Submissao(
                e.getId(),
                e.getLinguagem(),
                e.getCodigo(),
                e.getStatus(),
                e.getHoraSubmissao(),
                e.getTempoExecucao(),
                e.getAlunoId(),
                e.getProblemaId()
        );
    }

    public static SubmissaoEntity toEntity(Submissao s) {
        if (s == null) return null;

        SubmissaoEntity e = new SubmissaoEntity();
        e.setId(s.getId());
        e.setLinguagem(s.getLinguagem());
        e.setCodigo(s.getCodigo());
        e.setStatus(s.getStatus());
        e.setHoraSubmissao(s.getHoraSubmissao());
        e.setTempoExecucao(s.getTempoExecucao());
        e.setAlunoId(s.getAlunoId());
        e.setProblemaId(s.getProblemaId());
        return e;
    }
}
