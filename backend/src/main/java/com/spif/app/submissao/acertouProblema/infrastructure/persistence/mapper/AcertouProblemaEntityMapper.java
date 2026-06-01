package com.spif.app.submissao.acertouProblema.infrastructure.persistence.mapper;

import com.spif.app.submissao.acertouProblema.domain.AcertouProblema;
import com.spif.app.submissao.acertouProblema.infrastructure.persistence.entity.AcertouProblemaEntity;

public class AcertouProblemaEntityMapper {
    public static AcertouProblema toDomain(AcertouProblemaEntity e) {
        if (e == null) return null;

        return new AcertouProblema(
                e.getId(),
                e.getPontosGanhos(),
                e.getHoraAcerto(),
                e.getAlunoId(),
                e.getProblemaId()
        );
    }

    public static AcertouProblemaEntity toEntity(AcertouProblema a) {
        if (a == null) return null;

        AcertouProblemaEntity e = new AcertouProblemaEntity();

        e.setId(a.getId());
        e.setPontosGanhos(a.getPontosGanhos());
        e.setHoraAcerto(a.getHoraAcerto());
        e.setAlunoId(a.getAlunoId());
        e.setProblemaId(a.getProblemaId());

        return e;
    }
}
