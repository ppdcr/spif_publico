package com.spif.app.problema.application.ports.in;

import com.spif.app.problema.web.dto.in.CriarProblemaRequest;
import com.spif.app.problema.web.dto.out.ProblemaResponse;

public interface CriarProblemaInputPort {
    ProblemaResponse criar(CriarProblemaRequest request);
}
