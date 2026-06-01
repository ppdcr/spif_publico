DROP DATABASE IF EXISTS spif;
CREATE DATABASE spif WITH ENCODING 'UTF8';

CREATE TYPE user_message_role_type AS ENUM ('USER', 'MODEL');
CREATE TYPE mensagem_role_type AS ENUM ('USER', 'PROBLEM');
CREATE TYPE role_type AS ENUM ('ROLE_PROFESSOR', 'ROLE_ALUNO');
CREATE TYPE erro_type AS ENUM (
    'WRONG_ANSWER',
    'TIME_LIMIT_EXCEEDED',
    'MEMORY_LIMIT_EXCEEDED',
    'RUNTIME_ERROR'
    );
CREATE TYPE status_type AS ENUM (
    'PENDENTE',
    'PROCESSANDO',
    'ACEITO',
    'REJEITADO',
    'COMPILATION_ERROR'
    );
CREATE TYPE linguagem_type AS ENUM ('PYTHON', 'CPP', 'JAVA', 'C', 'JAVASCRIPT');

CREATE TABLE usuario (
                         id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         prontuario TEXT NOT NULL UNIQUE,
                         senha TEXT NOT NULL,
                         nickname TEXT NOT NULL,
                         email TEXT UNIQUE NOT NULL,
                         data_criacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                         role role_type NOT NULL
);

CREATE TABLE aluno (
                       id BIGINT PRIMARY KEY REFERENCES usuario(id),
                       pontos INT DEFAULT 0
);

CREATE TABLE professor (
                           id BIGINT PRIMARY KEY REFERENCES usuario(id),
                           elogios INT DEFAULT 0
);

CREATE TABLE problema (
                          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                          titulo VARCHAR(40) NOT NULL,
                          enunciado TEXT NOT NULL,
                          entrada TEXT NOT NULL,
                          saida TEXT NOT NULL,
                          dificuldade SMALLINT NOT NULL,
                          tempo_limite NUMERIC(6,3) NOT NULL,
                          memoria_limite_mb INT DEFAULT 256,
                          visivel BOOLEAN DEFAULT TRUE,

                          id_professor BIGINT NOT NULL REFERENCES professor(id)
);

CREATE TABLE caso_teste (
                            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                            entrada TEXT NOT NULL,
                            saida TEXT NOT NULL,
                            visivel BOOLEAN NOT NULL DEFAULT FALSE,
                            ordem INT NOT NULL,

                            id_problema BIGINT NOT NULL REFERENCES problema(id)
);

CREATE TABLE mensagem (
                           id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           conteudo TEXT NOT NULL,
                           horario_enviada TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                           id_remetente BIGINT NOT NULL REFERENCES usuario(id),
                           role mensagem_role_type NOT NULL
);

CREATE TABLE mensagem_usuario (
                           id BIGINT PRIMARY KEY REFERENCES mensagem(id),
                           id_destinatario BIGINT NOT NULL REFERENCES usuario(id),
                           id_mensagem_pai BIGINT REFERENCES mensagem_usuario(id),
                           conteudo_mensagem_pai TEXT NOT NULL,
                           horario_lida TIMESTAMPTZ
);

CREATE TABLE mensagem_problema (
                           id BIGINT PRIMARY KEY REFERENCES mensagem(id),
                           id_problema BIGINT NOT NULL REFERENCES problema(id),
                           tipo_remetente user_message_role_type DEFAULT 'USER'
);

CREATE TABLE submissao (
                           id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           hora_submissao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                           linguagem linguagem_type DEFAULT 'PYTHON',
                           status status_type DEFAULT 'PENDENTE',
                           codigo TEXT NOT NULL,
                           tempo_execucao NUMERIC(6,3),

                           id_aluno BIGINT NOT NULL REFERENCES aluno(id),
                           id_problema BIGINT NOT NULL REFERENCES problema(id)
);

CREATE TABLE assunto (
                         id_problema BIGINT NOT NULL REFERENCES problema(id),
                         categoria TEXT NOT NULL,
                         PRIMARY KEY (id_problema, categoria)
);

CREATE TABLE competicao (
                            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                            nome TEXT NOT NULL,
                            descricao TEXT NOT NULL,
                            data_inicio TIMESTAMPTZ NOT NULL,
                            data_fim TIMESTAMPTZ,
                            ativa BOOLEAN DEFAULT TRUE
);

CREATE TABLE participa (
                           id_competicao BIGINT NOT NULL REFERENCES competicao(id),
                           id_problema BIGINT NOT NULL REFERENCES problema(id),
                           PRIMARY KEY (id_competicao, id_problema)
);

CREATE TABLE percurso (
                          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                          nome TEXT NOT NULL
);

CREATE TABLE nivel (
                       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       nome TEXT NOT NULL,
                       ordem SMALLINT NOT NULL,
                       descricao TEXT NOT NULL,

                       id_percurso BIGINT NOT NULL REFERENCES percurso(id)
);

CREATE TABLE contem (
                        id_nivel BIGINT NOT NULL REFERENCES nivel(id),
                        id_problema BIGINT NOT NULL REFERENCES problema(id),
                        PRIMARY KEY (id_nivel, id_problema)
);

CREATE TABLE resultado (
                           id_submissao BIGINT NOT NULL REFERENCES submissao(id),
                           id_caso_teste BIGINT NOT NULL REFERENCES caso_teste(id),
                           saida TEXT,
                           erro erro_type,
                           tempo_gasto NUMERIC(6,3),

                           PRIMARY KEY (id_submissao, id_caso_teste)
);

CREATE TABLE disciplina (
                            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                            nome TEXT NOT NULL,
                            ano INT NOT NULL
);

CREATE TABLE cursa (
                       id_disciplina BIGINT NOT NULL REFERENCES disciplina(id),
                       id_usuario BIGINT NOT NULL REFERENCES usuario(id),
                       data_inicio TIMESTAMPTZ,
                       data_fim TIMESTAMPTZ,
                       ativo BOOLEAN DEFAULT FALSE,

                       PRIMARY KEY (id_disciplina, id_usuario)
);

CREATE TABLE turma (
                       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       id_disciplina BIGINT NOT NULL REFERENCES disciplina(id),
                       codigo_convite TEXT NOT NULL,
                       nome TEXT NOT NULL
);

CREATE TABLE lista_problemas (
                                 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                 id_professor BIGINT NOT NULL REFERENCES professor(id),
                                 titulo TEXT NOT NULL,
                                 descricao TEXT NOT NULL,
                                 dataCriacao TIMESTAMPTZ NOT NULL
);

CREATE TABLE lista_turma (
                                id_lista BIGINT NOT NULL REFERENCES lista_problemas(id),
                                id_turma BIGINT NOT NULL REFERENCES turma(id),
                                data_inicio TIMESTAMPTZ NOT NULL,
                                data_fim TIMESTAMPTZ,
                                ativo BOOLEAN DEFAULT TRUE,

                                PRIMARY KEY (id_lista, id_turma)
);

CREATE TABLE item_lista (
                            id_lista BIGINT NOT NULL REFERENCES lista_problemas(id),
                            id_problema BIGINT NOT NULL REFERENCES problema(id),
                            PRIMARY KEY (id_lista, id_problema)
);

CREATE TABLE ingressa (
                          id_turma BIGINT NOT NULL REFERENCES turma(id),
                          id_usuario BIGINT NOT NULL REFERENCES usuario(id),
                          data_ingresso TIMESTAMPTZ,
                          ativo BOOLEAN DEFAULT FALSE,

                          PRIMARY KEY (id_turma, id_usuario)
);

CREATE TABLE acertou_problema (
                                  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                  id_aluno BIGINT NOT NULL REFERENCES aluno(id),
                                  id_problema BIGINT NOT NULL REFERENCES problema(id),
                                  pontos_ganhos INT NOT NULL,
                                  hora_acerto TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

                                  UNIQUE(id_aluno, id_problema)
);

CREATE TABLE refresh_token (
                               id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                               token VARCHAR(255) NOT NULL UNIQUE,
                               data_expiracao TIMESTAMPTZ NOT NULL,
                               id_usuario BIGINT NOT NULL REFERENCES usuario(id)
);