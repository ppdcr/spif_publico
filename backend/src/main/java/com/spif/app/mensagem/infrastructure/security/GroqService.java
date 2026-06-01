package com.spif.app.mensagem.infrastructure.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GroqService {
    private final RestClient restClient;

    @Value("${app.groq.api-key}")
    private String apiKey;

    public GroqService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }

    public String gerarResposta(String promptInicial, List<Map<String, Object>> historico, String promptAtual) {
        var messages = new ArrayList<Map<String, Object>>();

        // system prompt
        messages.add(Map.of("role", "system", "content", INSTRUCAO_SISTEMA + "\n\n" + promptInicial));

        // histórico — precisa converter do formato Gemini para OpenAI
        for (var msg : historico) {
            String role = msg.get("role").equals("model") ? "assistant" : "user";
            var parts = (List<Map<String, Object>>) msg.get("parts");
            String content = (String) parts.getFirst().get("text");
            messages.add(Map.of("role", role, "content", content));
        }

        // mensagem atual
        messages.add(Map.of("role", "user", "content", promptAtual));

        var requestBody = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", messages,
                "max_tokens", 1024,
                "temperature", 0.4
        );

        try {
            var response = restClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            var choices = (List<Map<String, Object>>) response.get("choices");
            var message = (Map<String, Object>) choices.getFirst().get("message");
            return (String) message.get("content");

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().value() == 429) {
                throw new IARateLimitException("Limite de requisições atingido. Tente novamente em instantes.");
            }
            throw new IAException("Erro ao consultar IA: " + e.getStatusCode());
        } catch (Exception e) {
            throw new IAException("Erro inesperado ao consultar IA.");
        }
    }

    private static final String INSTRUCAO_SISTEMA = """
        Você é o "Professor Robif", um tutor de programação competitiva extremamente focado, direto e minimalista que utiliza o método socrático estrito.
        Sua missão NÃO é explicar tudo, mas sim fazer as perguntas certas e dar pistas minimalistas para que o aluno chegue à conclusão sozinho.

        DIRETRIZES DE ESTILO E TAMANHO:
        - Seja extremamente conciso. Suas respostas devem ter no máximo 2 a 3 parágrafos curtos (ou poucas linhas). Evite textos longos.
        - Não faça introduções cordiais ou encerramentos repetitivos (Ex: "Estou aqui para ajudar", "Boa sorte!"). Vá direto ao ponto técnico.
        - Use formatação limpa (negrito para termos importantes e blocos de código inline para variáveis ou funções).

        REGRAS DE CONTEÚDO (MÉTODO SOCRÁTICO):
        - Nunca resolva o problema, nunca diga qual linha mudar e nunca dê a lógica mastigada.
        - Plante apenas uma "semente" ou hipótese por vez. Deixe o aluno validar se ela é verdadeira.
        - Se o aluno estiver errando um caso de teste, faça ele simular o fluxo manualmente com uma pergunta instigante sobre a entrada do teste.
        - Nunca dê exemplos extensos de código corrigido. Se precisar ilustrar uma estrutura, use uma sintaxe genérica ou abstrata.

        RESTRIÇÃO ABSOLUTA DE CONTEXTO:
        - Você está proibido de falar sobre qualquer assunto externo à ciência da computação, programação e ao problema específico do juiz online (proibido analogias com filmes, literatura, cultura pop, culinária ou piadas).
        - Se o aluno tentar desviar o assunto com perguntas fora do contexto do problema, responda estritamente: "Foco no problema. Como posso te ajudar a evoluir na solução deste código?".
    """;

    public static class IARateLimitException extends RuntimeException {
        public IARateLimitException(String message) { super(message); }
    }

    public static class IAException extends RuntimeException {
        public IAException(String message) { super(message); }
    }
}
