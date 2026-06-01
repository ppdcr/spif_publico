package com.spif.app.shared.email;

import com.spif.app.disciplina.turma.application.ports.out.TurmaRepository;
import com.spif.app.disciplina.turma.domain.Turma;
import com.spif.app.disciplina.turma.ingressa.application.ports.out.IngressaRepository;
import com.spif.app.lista.application.ports.out.ListaProblemasRepository;
import com.spif.app.lista.domain.ListaProblemas;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class NotificarNovaListaTurma {

    private final EmailService emailService;
    private final UsuarioRepository usuarioRepository;
    private final IngressaRepository ingressaRepository;
    private final TurmaRepository turmaRepository;
    private final ListaProblemasRepository listaProblemasRepository;

    private void notificarNovaListaTurma(String emailUsuario, String nomeUsuario, String nomeTurma, String tituloLista, long disciplinaId, long turmaId) {

        Context context = new Context();
        context.setVariable("nomeUsuario", nomeUsuario);
        context.setVariable("nomeTurma", nomeTurma);
        context.setVariable("tituloLista", tituloLista);
        context.setVariable("linkAcesso", "https://spif.com.br/spif/v1/disciplinas/" + disciplinaId + "/turmas/" + turmaId + "/listas");

        // Chama o envio passando o nome do arquivo HTML (sem a extensão .html)
        emailService.enviarEmailHtml(
                emailUsuario,
                "Nova Lista de Problemas!",
                context,
                "emailNovaListaTurma" // Nome do template em resources/templates
        );
    }

    @Async
    public void carregarENotificar(long disciplinaId, long turmaId, long listaId) {
        Turma turma = turmaRepository.buscarPorId(disciplinaId, turmaId).orElseThrow(() -> new IllegalArgumentException("Turma não encontrada nessa disciplina."));
        ListaProblemas lista = listaProblemasRepository.buscarPorId(listaId).orElseThrow(() -> new IllegalArgumentException("Lista de problemas não encontrada."));

        ingressaRepository.listarUsuariosAtivosPorTurma(turmaId).forEach(i -> {
            Usuario usuario = usuarioRepository.buscarPorId(i.getUsuarioId()).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
            notificarNovaListaTurma(usuario.getEmail(), usuario.getNickname(), turma.getNome(), lista.getTitulo(), disciplinaId, turmaId);
        });
    }
}
