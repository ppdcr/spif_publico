package com.spif.app.shared.email;

import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class NotificarConviteTurma {

    private final TurmaRepository turmaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    private void notificarConviteTurma(String emailAluno, String nomeUsuario, String nomeTurma, long disciplinaId) {

        Context context = new Context();
        context.setVariable("nomeUsuario", nomeUsuario);
        context.setVariable("nomeTurma", nomeTurma);
        context.setVariable("linkAcesso", "https://spif.com.br/spif/v1/disciplinas/" + disciplinaId + "/turmas/my/convites");

        emailService.enviarEmailHtml(
                emailAluno,
                "Novo convite para turma!",
                context,
                "emailConviteTurma"
        );

    }

    @Async
    public void carregarENotificar(long usuarioId, long disciplinaId, long turmaId) {
        Turma turma = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));
        Usuario usuario = usuarioRepository.buscarPorId(usuarioId).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        notificarConviteTurma(usuario.getEmail(), usuario.getNickname(), turma.getNome(), turma.getDisciplinaId());
    }
}
