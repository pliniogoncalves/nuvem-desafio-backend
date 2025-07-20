# Desafio Técnico: Backend para Plataforma de Documentos

[cite_start]API RESTful desenvolvida como parte do processo seletivo para a vaga de Desenvolvedor Backend [cite: 3][cite_start], focada em ingestão de documentos, autenticação de usuários e simulação de buscas com IA[cite: 5].

## 📋 Tabela de Conteúdos

- [Tecnologias Obrigatórias](#-tecnologias-obrigatórias)
- [Diferenciais Implementados](#-diferenciais-implementados)
- [Modelagem de Dados](#-modelagem-de-dados)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Documentação da API](#-documentação-da-api)
- [Fluxograma da Aplicação](#-fluxograma-da-aplicação)

## [cite_start]✨ Tecnologias Obrigatórias [cite: 10]

- [cite_start]**Runtime:** Node.js [cite: 11]
- [cite_start]**Framework:** Express.js [cite: 11]
- [cite_start]**Banco de Dados:** PostgreSQL [cite: 12]
- [cite_start]**ORM:** Prisma ORM [cite: 12]
- [cite_start]**Autenticação:** JSON Web Tokens (JWT) [cite: 13]
- [cite_start]**Upload de Arquivos:** Multer [cite: 14]
- [cite_start]**Containerização:** Docker e Docker Compose 
- [cite_start]**Documentação:** Swagger [cite: 16]

## [cite_start]🚀 Diferenciais Implementados [cite: 17]

- [ ] [cite_start]Endpoint `/me` para retorno de informações do usuário autenticado[cite: 19].
- [ ] [cite_start]Testes automatizados com Jest[cite: 21].
- [ ] [cite_start]Fluxograma visual explicativo da arquitetura da aplicação[cite: 18].
- [ ] [cite_start]Interface do Swagger utilizada para consumo e teste dos endpoints[cite: 20].

## [cite_start]📦 Modelagem de Dados [cite: 49]

O banco de dados relacional foi modelado com as seguintes tabelas:

- **users**: Armazena os dados dos usuários. [cite_start](`id, nome, email, senha_hash`) [cite: 50]
- **datasets**: Armazena metadados dos documentos enviados. [cite_start](`id, nome, usuario_id, criado_em`) [cite: 51]
- **records**: Armazena o conteúdo extraído dos documentos em formato JSON. [cite_start](`id, dataset_id, dados_json, criado_em`) [cite: 52]
- **queries**: Registra o histórico de buscas simuladas via IA. [cite_start](`id, usuario_id, pergunta, resposta, criado_em`) [cite: 53]

## ▶️ Como Executar o Projeto

**Pré-requisitos:**
- Docker
- Docker Compose
- Git

1. **Clone o repositório:**
   ```bash
   git clone SUA_URL_DO_REPOSITORIO_AQUI.git
   cd desafio-backend
   ```

2. **Crie o arquivo de variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example` (que criaremos mais tarde). Ele conterá a URL do banco de dados e o segredo do JWT.

3. **Inicie os containers com Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

4. **Execute as migrações do banco de dados:**
   Após os containers estarem no ar, execute o seguinte comando para criar as tabelas no banco de dados:
   ```bash
   docker-compose exec app npx prisma migrate dev
   ```

A aplicação estará disponível em `http://localhost:3000`.

## swagger Documentação da API

A documentação completa dos endpoints, gerada com Swagger, está disponível em:

[cite_start]**`http://localhost:3000/api-docs`** [cite: 60]

## 🌐 Fluxograma da Aplicação

[cite_start]*(Esta seção será preenchida com um fluxograma visual) [cite: 18]*