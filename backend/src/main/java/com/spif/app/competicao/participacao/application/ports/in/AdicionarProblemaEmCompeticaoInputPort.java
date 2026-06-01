package com.spif.app.competicao.participacao.application.ports.in;

import com.spif.app.competicao.participacao.web.dto.in.AdicionarProblemaEmCompeticaoRequest;
import com.spif.app.competicao.participacao.web.dto.out.ParticipacaoResponse;

public interface AdicionarProblemaEmCompeticaoInputPort {
    ParticipacaoResponse adicionar(long competicaoId, AdicionarProblemaEmCompeticaoRequest request);
}
