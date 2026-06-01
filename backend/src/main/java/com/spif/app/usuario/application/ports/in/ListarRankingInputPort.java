package com.spif.app.usuario.application.ports.in;

import com.spif.app.usuario.web.dto.out.RankingResponse;

public interface ListarRankingInputPort {
    RankingResponse listarRanking();
}
