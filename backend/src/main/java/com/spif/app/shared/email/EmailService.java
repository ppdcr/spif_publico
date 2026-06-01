package com.spif.app.shared.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void enviarEmailHtml(String destinatario, String assunto, Context contextoVariaveis, String nomeTemplate) {
        try {
            // 1. Processa o HTML com as variáveis
            String htmlFinal = templateEngine.process(nomeTemplate, contextoVariaveis);

            // 2. Prepara a mensagem com suporte a HTML
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setFrom("sap.ifsp@gmail.com");

            // O "true" indica que o texto é um HTML
            helper.setText(htmlFinal, true);

            // 3. Envia!
            mailSender.send(mimeMessage);
            log.info("E-mail HTML enviado com sucesso para: {}", destinatario);

        } catch (MessagingException e) {
            log.error("Erro ao enviar e-mail HTML para: {}", destinatario, e);
            // Dependendo da sua regra de negócio, você pode lançar uma exceção personalizada aqui
        }
    }
}
