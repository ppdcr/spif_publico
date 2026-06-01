package com.spif.app.submissao.resultado.infrastructure.persistence.entity;

public record ResultadoId (
        long submissaoId,
        long casoTesteId
) { }
