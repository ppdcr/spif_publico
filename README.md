# SPIF — Sistema de Aprendizado de Programação do Instituto Federal

## Sobre o projeto

O SPIF é uma plataforma web voltada à preparação de estudantes para competições de programação, como a Olimpíada Brasileira de Informática (OBI) e a Maratona de Programação INTERIF. O sistema integra organização pedagógica, prática de resolução de problemas e assistência por inteligência artificial generativa.

A plataforma oferece funcionalidades de cadastro e autenticação de usuários, gestão de problemas com casos de teste, criação de listas, disciplinas, turmas, percursos e competições, submissões com registro de desempenho, sistema de mensagens e um tutor de IA configurado para orientar o estudante sem fornecer soluções prontas.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

## Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd <nome-da-pasta>
```

### 2. Crie o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env` e preencha as variáveis abaixo com os seus valores:

```env
# Chaves de IA
GEMINI_API_KEY=sua_chave_gemini_aqui
GROQ_API_KEY=sua_chave_groq_aqui

# Autenticação
JWT_SECRET=seu_segredo_jwt_aqui

# Banco de dados
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui

# RabbitMQ
RABBITMQ_PASSWORD=sua_senha_rabbitmq_aqui

# URLs
FRONTEND_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:8080/spif/v1
APP_CORS_PATTERN=http://127.0.0.1:*

# E-mail
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=sua_senha_de_app_aqui
```

### 3. Suba os containers

Com o `.env` criado e preenchido, execute:

```bash
docker compose pull
```

Agora com as imagens instaladas, execute:

```bash
docker compose up --build
```

Aguarde todos os serviços iniciarem. Na primeira execução, o build pode demorar alguns minutos.

## Acesso

Após subir os containers, acesse:

| Serviço   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:3000        |
| Backend   | http://localhost:8080/spif/v1 |

## Encerrando o sistema

Para parar todos os containers:

```bash
docker compose down
```

Para parar e remover os volumes (banco de dados):

```bash
docker compose down -v
```
