package com.spif.app.usuario.application.usecases;

import com.spif.app.usuario.application.ports.in.ListarUsuariosInputPort;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.web.dto.out.UsuarioResumoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ListarUsuariosUseCase implements ListarUsuariosInputPort {

    private final UsuarioRepository usuarioRepository;

    @Override
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    public List<UsuarioResumoResponse> listarPorNome(String nome) {
        log.info("Buscando usuários por nome: '{}'", nome);
        try {
            List<UsuarioResumoResponse> resultado = usuarioRepository.buscarPorNome(nome)
                    .stream()
                    .map(UsuarioResumoResponse::fromDomain)
                    .toList();
            log.info("Encontrados {} usuários para o termo '{}'", resultado.size(), nome);
            return resultado;
        } catch (Exception e) {
            log.error("Erro ao buscar usuários por nome: '{}'", nome, e);
            throw e;
        }
    }
}
