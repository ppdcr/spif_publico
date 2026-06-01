package com.spif.app.shared.email;

import com.spif.app.disciplina.application.ports.out.DisciplinaRepository;
import com.spif.app.disciplina.domain.Disciplina;
import com.spif.app.usuario.application.ports.out.UsuarioRepository;
import com.spif.app.usuario.domain.Aluno;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class NotificarConviteDisciplina {

    private final EmailService emailService;
    private final UsuarioRepository usuarioRepository;
    private final DisciplinaRepository disciplinaRepository;

    private void notificarConviteDisciplina(String emailAluno, String nomeAluno, String nomeDisciplina, int anoDisciplina) {

        // Colocamos as variáveis que o arquivo email-competicao.html espera
        Context context = new Context();
        context.setVariable("nomeAluno", nomeAluno);
        context.setVariable("nomeDisciplina", nomeDisciplina);
        context.setVariable("anoDisciplina", anoDisciplina);
        context.setVariable("linkAcesso", "https://spif.com.br/spif/v1/disciplinas/my/convites");

        // Chama o envio passando o nome do arquivo HTML (sem a extensão .html)
        emailService.enviarEmailHtml(
                emailAluno,
                "Novo convite para disciplina!",
                context,
                "emailConviteDisciplina" // Nome do template em resources/templates
        );
    }

    @Async
    public void carregarENotificar(long alunoId, long disciplinaId) {
        Disciplina disciplina = disciplinaRepository.buscarPorId(disciplinaId).orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada."));
        Aluno aluno = (Aluno) usuarioRepository.buscarPorId(alunoId).orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado."));

        notificarConviteDisciplina(aluno.getEmail(), aluno.getNickname(), disciplina.getNome(), disciplina.getAno());
    }
}
