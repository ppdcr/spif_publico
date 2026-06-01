package com.spif.app.usuario.web.dto.out;

import java.util.List;

public record RankingResponse(
        List<UsuarioResponse> rankingAlunos,
        List<UsuarioResponse> rankingProfessores
) {}