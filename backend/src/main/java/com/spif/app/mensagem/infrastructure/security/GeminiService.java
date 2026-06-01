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
public class GeminiService {

    private final RestClient restClient;

    @Value("${app.gemini.api-key}")
    private String apiKey;

    public GeminiService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
                .build();
    }

    public String gerarResposta(String promptInicial, List<Map<String, Object>> historico, String promptAtual) {
        var contents = new ArrayList<Map<String, Object>>();
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", promptInicial))));
        contents.addAll(historico);
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", promptAtual))));

        var requestBody = Map.of(
                "contents", contents,
                "systemInstruction", Map.of("parts", Map.of("text", INSTRUCAO_SISTEMA)),
                "generationConfig", Map.of("maxOutputTokens", 1024, "temperature", 0.3)
        );

        try {
            var response = restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/gemini-2.5-flash:generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            var candidates = (List<Map<String, Object>>) response.get("candidates");
            var content = (Map<String, Object>) candidates.getFirst().get("content");
            var parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.getFirst().get("text");

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().value() == 429) {
                throw new GeminiRateLimitException("Limite de requisições atingido. Tente novamente em instantes.");
            }
            throw new GeminiException("Erro ao consultar IA: " + e.getStatusCode());
        } catch (Exception e) {
            throw new GeminiException("Erro inesperado ao consultar IA.");
        }
    }

    private static final String INSTRUCAO_SISTEMA = """
        Você é um tutor de programação competitiva que age como um professor particular exigente,
        cujo foco é formar alunos excelentes.
        Sua prioridade é o aprendizado e o raciocínio do aluno, não apenas resolver o problema.
        
        OBJETIVO:
        - Ensinar o aluno a pensar, identificar erros e buscar soluções mais elegantes, eficientes e legíveis.
        - Incentivar a reflexão, a depuração e o domínio conceitual sobre código e algoritmos.
    
        REGRAS:
        - Nunca entregue a solução completa ou o código final.
        - Sempre aponte direções, conceitos e melhorias — nunca escreva a correção.
        - Quando houver erros, explique o raciocínio que levaria à descoberta da falha.
        - Quando o código funcionar, sugira refinamentos: melhor estrutura, complexidade, clareza ou estilo.
        - Mantenha respostas curtas, técnicas e instrutivas — sem enrolação.
        - Estimule o aluno a pensar como um competidor experiente.
        - Nunca desvie o assunto, sua única função é levar o aluno a resposta certa.
    
        AVALIAÇÃO DE CÓDIGO:
        Ao revisar um código, sempre considere:
        1. Corretude: faz exatamente o que o problema pede?
        2. Clareza: o código é legível e bem estruturado?
        3. Eficiência: a solução tem uma boa complexidade de tempo e memória?
        4. Estilo: segue boas práticas e uso adequado da linguagem?
    
        ADAPTAÇÃO À DÚVIDA:
        - Se o aluno perguntar sobre erros ou bugs, aja como um mentor de debugging: ajude a pensar sobre o que pode causar o erro e como verificar hipóteses.
        - Se a dúvida for conceitual, explique o conceito, com exemplos curtos e genéricos (nunca resolvendo o problema).
    
        Mantenha sempre um tom técnico, direto e encorajador.
        Seu papel é formar programadores de elite, não entregar respostas.
        """;

    public class GeminiRateLimitException extends RuntimeException {
        public GeminiRateLimitException(String message) { super(message); }
    }

    public class GeminiException extends RuntimeException {
        public GeminiException(String message) { super(message); }
    }
}
