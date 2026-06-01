package com.spif.app.problema.application.usecases;

import com.spif.app.problema.application.ports.in.AtualizarProblemaInputPort;
import com.spif.app.problema.application.ports.out.ProblemaRepository;
import com.spif.app.problema.domain.Problema;
import com.spif.app.problema.web.dto.in.AtualizarProblemaRequest;
import com.spif.app.problema.web.dto.out.ProblemaResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AtualizarProblemaUseCase implements AtualizarProblemaInputPort {


    private final ProblemaRepository problemaRepository;


    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    @Transactional
    public ProblemaResponse atualizar(Long id, AtualizarProblemaRequest request) {
        long professorId = AuthUtil.getUsuarioId();

        Problema existente = problemaRepository.buscarPorId(id).orElseThrow(() -> new IllegalArgumentException("Problema não encontrado."));

        if (existente.getProfessorId() != professorId) {
            throw new SecurityException("Apenas o dono do problema pode atualizar.");
        }

        Problema updated = existente.atualizar(
                request.titulo(),
                request.enunciado(),
                request.entrada(),
                request.saida(),
                request.dificuldade(),
                request.tempoLimite(),
                request.memoriaLimiteMb(),
                request.visivel(),
                request.assuntos()
        );

        Problema salvo = problemaRepository.salvar(updated);
        return ProblemaResponse.fromDomain(salvo);
    }
}
