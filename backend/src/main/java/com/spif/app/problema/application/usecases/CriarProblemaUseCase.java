package com.spif.app.problema.application.usecases;

import com.spif.app.problema.application.ports.in.CriarProblemaInputPort;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.domain.Problema;
import com.spif.app.problema.web.dto.in.CriarProblemaRequest;
import com.spif.app.problema.web.dto.out.ProblemaResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CriarProblemaUseCase implements CriarProblemaInputPort {

    private final ProblemaRepository problemaRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public ProblemaResponse criar(CriarProblemaRequest request) {
        long professorId = AuthUtil.getUsuarioId();

        Problema p = Problema.criar(request.titulo(), request.enunciado(), request.entrada(), request.saida(), request.dificuldade(), BigDecimal.valueOf(request.tempoLimite()), request.memoriaLimiteMb(), professorId, request.assuntos());

        Problema salvo = problemaRepository.salvar(p);
        return ProblemaResponse.fromDomain(salvo);
    }
}
