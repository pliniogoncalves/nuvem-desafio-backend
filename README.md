# Desafio Técnico: Backend para Plataforma de Documentos

API RESTful desenvolvida como parte do processo seletivo para a vaga de Desenvolvedor Backend, focada em ingestão de documentos, autenticação de usuários e simulação de buscas com IA.

## 📋 Tabela de Conteúdos

* [Tecnologias Obrigatórias](#-tecnologias-obrigatórias)
* [Diferenciais Implementados](#-diferenciais-implementados)
* [Modelagem de Dados](#-modelagem-de-dados)
* [Como Executar o Projeto](#-como-executar-o-projeto)
* [Documentação da API](#-documentação-da-api)
* [Fluxograma da Aplicação](#-fluxograma-da-aplicação)

## ✨ Tecnologias Obrigatórias

* **Runtime:** Node.js
* **Framework:** Express.js
* **Banco de Dados:** PostgreSQL
* **ORM:** Prisma ORM
* **Autenticação:** JSON Web Tokens (JWT)
* **Upload de Arquivos:** Multer
* **Containerização:** Docker e Docker Compose
* **Documentação:** Swagger

## 🚀 Diferenciais Implementados

* [x] Endpoint `/me` para retorno de informações do usuário autenticado.
* [x] Testes automatizados com Jest.
* [x] Fluxograma visual explicativo da arquitetura da aplicação.
* [x] Interface do Swagger utilizada para consumo e teste dos endpoints.

## 📦 Modelagem de Dados

O banco de dados relacional foi modelado com as seguintes tabelas:

* **users**: Armazena os dados dos usuários (`id, nome, email, senha_hash`).
* **datasets**: Armazena metadados dos documentos enviados (`id, nome, usuario_id, criado_em`).
* **records**: Armazena o conteúdo extraído dos documentos em formato JSON (`id, dataset_id, dados_json, criado_em`).
* **queries**: Registra o histórico de buscas simuladas via IA (`id, usuario_id, pergunta, resposta, criado_em`).

## ▶️ Como Executar o Projeto

**Pré-requisitos:**

* Docker
* Docker Compose
* Git

1. **Clone o repositório:**

   ```bash
   git clone SUA_URL_DO_REPOSITORIO_AQUI.git
   cd nome-do-repositorio
   ```

2. **Crie o arquivo de variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto e preencha com as seguintes variáveis:

   ```env
   DATABASE_URL="postgresql://docker:docker@db:5432/desafio_db?schema=public"
   DB_USER=docker
   DB_PASSWORD=docker
   DB_NAME=desafio_db
   JWT_SECRET="seu_segredo_super_secreto"
   ```

3. **Inicie os containers com Docker Compose:**

   ```bash
   docker-compose up -d --build
   ```

4. **Execute as migrações do banco de dados:**

   Após os containers estarem no ar, execute o seguinte comando para criar as tabelas no banco de dados:

   ```bash
   docker-compose exec app npx prisma migrate dev
   ```

5. A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## 📖 Documentação da API

A documentação completa e interativa dos endpoints, gerada com Swagger, está disponível em:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 🌐 Fluxograma da Aplicação

```mermaid
graph TD
    A[Usuário] --> B[API_RESTful_Express]
    B --> C[Middleware_JWT]
    C --> D[Controller]
    D --> E[Prisma_ORM]
    E --> F[PostgreSQL_DB]
    D --> B
    B --> A

    subgraph Fluxo_de_Upload
        U1[Usuário_com_Arquivo] --> B
        C --> UC[Controller_Dataset]
        UC --> M[Multer]
        M --> S[Salva_Arquivo]
        UC --> P[Processa_Arquivo]
        P --> E
    end
