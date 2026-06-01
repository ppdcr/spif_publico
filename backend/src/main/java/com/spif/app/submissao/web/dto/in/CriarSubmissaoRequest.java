package com.spif.app.submissao.web.dto.in;

import com.spif.app.submissao.domain.Linguagem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CriarSubmissaoRequest(
        @NotNull Linguagem linguagem,
        @NotBlank String codigo
) { }
