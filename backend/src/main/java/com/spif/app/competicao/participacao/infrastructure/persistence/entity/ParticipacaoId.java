package com.spif.app.competicao.participacao.infrastructure.persistence.entity;

public record ParticipacaoId(
        long competicaoId,
        long problemaId
) { }
