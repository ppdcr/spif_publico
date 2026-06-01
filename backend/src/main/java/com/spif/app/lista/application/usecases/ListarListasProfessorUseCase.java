package com.spif.app.lista.application.usecases;

import com.spif.app.lista.application.ports.in.ListarListasProfessorInputPort;
import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.web.dto.out.ListaProblemasResponse;
import com.spif.app.shared.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarListasProfessorUseCase implements ListarListasProfessorInputPort {

    private final ListaProblemasRepository listaProblemasRepository;

    @Override
    public List<ListaProblemasResponse> listarListasProfessor(String titulo) {
        long professorId = AuthUtil.getUsuarioId();

        if (titulo != null) {
            return listaProblemasRepository.buscarPorProfessorETitulo(professorId, titulo).stream()
                .map(ListaProblemasResponse::fromDomain).toList();
        }

        return listaProblemasRepository.buscarPorProfessor(professorId).stream()
                .map(ListaProblemasResponse::fromDomain).toList();
    }
}
