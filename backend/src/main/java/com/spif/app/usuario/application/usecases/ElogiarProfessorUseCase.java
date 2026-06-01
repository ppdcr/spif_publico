package com.spif.app.usuario.application.usecases;

import com.spif.app.usuario.application.ports.in.ElogiarProfessorInputPort;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Professor;
import com.spif.app.usuario.domain.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ElogiarProfessorUseCase implements ElogiarProfessorInputPort {

    private final UsuarioRepository usuarioRepository;

    @Override
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public void elogiar(long professorId) {
        Usuario u = usuarioRepository.buscarPorId(professorId).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        if (u.getRole().name().equals("ROLE_ALUNO")) {
            throw new IllegalArgumentException("Esse usuário não é um professor.");
        }

        Professor elogiado = ((Professor) u).elogiar();
        usuarioRepository.salvar(elogiado);
    }
}
