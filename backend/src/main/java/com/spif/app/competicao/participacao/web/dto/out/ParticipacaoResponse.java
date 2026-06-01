package com.spif.app.competicao.participacao.web.dto.out;

import lombok.Data;

import java.util.List;

@Data
public class ParticipacaoResponse {
    private List<Long> problemaIds;

    public static ParticipacaoResponse fromList(List<Long> problemaIds) {
        ParticipacaoResponse r = new ParticipacaoResponse();
        r.setProblemaIds(problemaIds);
        return r;
    }
}
