package com.spif.app.competicao.web.dto.out;

import com.spif.app.competicao.domain.Competicao;
import com.spif.app.competicao.infrastructure.persistence.repository.CompeticaoProjection;
import lombok.Data;

import java.time.OffsetDateTime;
import java.time.ZoneId;

@Data
public class CompeticaoResponse {
        private long id;
        private String nome;
        private String descricao;
        private OffsetDateTime dataInicio;
        private OffsetDateTime dataFim;
        private boolean ativa;
        private Double porcentagemConclusao;

        public static CompeticaoResponse fromProjection(CompeticaoProjection p) {
            CompeticaoResponse r = new CompeticaoResponse();

            r.id = p.getId();
            r.nome = p.getNome();
            r.descricao = p.getDescricao();
            r.dataInicio = p.getDataInicio() != null ? p.getDataInicio().atOffset(java.time.ZoneOffset.UTC) : null;
            r.dataFim = p.getDataFim() != null ? p.getDataFim().atOffset(java.time.ZoneOffset.UTC) : null;
            r.ativa = p.isAtiva();
            r.porcentagemConclusao = p.getPorcentagemConclusao();

            return r;
        }

        public static CompeticaoResponse fromDomain(Competicao c) {
            if (c == null) return null;

            CompeticaoResponse r = new CompeticaoResponse();
            r.id = c.getId();
            r.nome = c.getNome();
            r.descricao = c.getDescricao();
            r.dataInicio = c.getDataInicio();
            r.dataFim = c.getDataFim();
            r.ativa = c.isAtiva();

            return r;
        }
}
