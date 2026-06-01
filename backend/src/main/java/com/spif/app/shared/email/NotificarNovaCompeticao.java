package com.spif.app.shared.email;

import com.spif.app.competicao.application.ports.out.CompeticaoRepository;
import com.spif.app.competicao.domain.Competicao;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class NotificarNovaCompeticao {

    private final EmailService emailService;
    private final UsuarioRepository usuarioRepository;
    private final CompeticaoRepository competicaoRepository;

    private void notificarNovaCompeticao(String emailUsuario, String nomeUsuario, String nomeCompeticao) {

        Context context = new Context();
        context.setVariable("nomeUsuario", nomeUsuario);
        context.setVariable("nomeCompeticao", nomeCompeticao);
        context.setVariable("linkAcesso", "https://spif.com.br/spif/v1/competicoes");

        // Chama o envio passando o nome do arquivo HTML (sem a extensão .html)
        emailService.enviarEmailHtml(
                emailUsuario,
                "Nova Competição!",
                context,
                "emailNovaCompeticao" // Nome do template em resources/templates
        );
    }

    @Async
    public void carregarENotificar(long competicaoId) {
        Competicao competicao = competicaoRepository.buscarPorId(competicaoId).orElseThrow(() -> new IllegalArgumentException("Competição não encontrada."));
        usuarioRepository.buscarTodos().forEach(u ->
            notificarNovaCompeticao(u.getEmail(), u.getNickname(), competicao.getNome())
        );
    }

}
