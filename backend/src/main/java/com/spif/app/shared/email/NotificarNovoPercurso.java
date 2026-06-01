package com.spif.app.shared.email;

import com.spif.app.percurso.application.ports.out.PercursoRepository;
import com.spif.app.percurso.domain.Percurso;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class NotificarNovoPercurso {

    private final EmailService emailService;
    private final UsuarioRepository usuarioRepository;
    private final PercursoRepository percursoRepository;


    private void notificarNovoPercurso(String emailUsuario, String nomeUsuario, String nomePercurso) {

        Context context = new Context();
        context.setVariable("nomeUsuario", nomeUsuario);
        context.setVariable("nomePercurso", nomePercurso);
        context.setVariable("linkAcesso", "https://spif.com.br/spif/v1/percursos");

        // Chama o envio passando o nome do arquivo HTML (sem a extensão .html)
        emailService.enviarEmailHtml(
                emailUsuario,
                "Novo Percurso!",
                context,
                "emailNovoPercurso" // Nome do template em resources/templates
        );
    }

    @Async
    public void notificarGlobal(String nomePercurso) {
        usuarioRepository.buscarTodos().forEach(u ->
            notificarNovoPercurso(u.getEmail(), u.getNickname(), nomePercurso)
        );
    }
}
