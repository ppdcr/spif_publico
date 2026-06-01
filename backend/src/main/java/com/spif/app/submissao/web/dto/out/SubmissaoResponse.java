package com.spif.app.submissao.web.dto.out;

import com.spif.app.submissao.domain.Linguagem;
import com.spif.app.submissao.domain.Status;
import com.spif.app.submissao.domain.Submissao;
import com.spif.app.submissao.resultado.domain.Resultado;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class SubmissaoResponse {
    private Long id;
    private Linguagem linguagem;
    private String codigo;
    private Status status;
    private OffsetDateTime horaSubmissao;
    private BigDecimal tempoExecucao;
    private List<Resultado> resultados;

    public static SubmissaoResponse fromDomain(Submissao s) {
        SubmissaoResponse r = new SubmissaoResponse();
        r.id = s.getId();
        r.linguagem = s.getLinguagem();
        r.codigo = s.getCodigo();
        r.status = s.getStatus();
        r.horaSubmissao = s.getHoraSubmissao();
        r.tempoExecucao = s.getTempoExecucao();
        return r;
    }
}
