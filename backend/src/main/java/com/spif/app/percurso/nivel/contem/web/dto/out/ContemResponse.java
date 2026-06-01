package com.spif.app.percurso.nivel.contem.web.dto.out;

import lombok.Data;

import java.util.List;

@Data
public class ContemResponse {
    private List<Long> problemaIds;

    public static ContemResponse fromList(List<Long> problemaIds) {
        ContemResponse r = new ContemResponse();
        r.setProblemaIds(problemaIds);
        return r;
    }
}