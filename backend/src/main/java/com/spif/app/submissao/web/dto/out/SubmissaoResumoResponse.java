package com.spif.app.submissao.web.dto.out;

import com.spif.app.submissao.domain.Linguagem;
import com.spif.app.submissao.domain.Status;
import com.spif.app.submissao.domain.Submissao;
import lombok.Data;

@Data
public class SubmissaoResumoResponse {
    private Long id;
    private Linguagem linguagem;
    private Status status;

    public static SubmissaoResumoResponse fromDomain(Submissao s) {
        SubmissaoResumoResponse r = new SubmissaoResumoResponse();
        r.id = s.getId();
        r.linguagem = s.getLinguagem();
        r.status = s.getStatus();
        return r;
    }
}
