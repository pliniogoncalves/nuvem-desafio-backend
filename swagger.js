export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'API de Documentos - Desafio Técnico',
    version: '1.0.0',
    description: 'API RESTful para gerenciamento de documentos, usuários e queries de IA.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  tags: [
    { name: 'Autenticação', description: 'Endpoints de registro e login' },
    { name: 'Usuários', description: 'Operações do usuário autenticado' },
    { name: 'Datasets', description: 'Upload e gerenciamento de datasets' },
    { name: 'Records', description: 'Busca em registros de datasets' },
    { name: 'IA Mock', description: 'Simulação de queries de IA' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Registra um novo usuário',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/NewUser' } } },
        },
        responses: {
          '201': { description: 'Usuário registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          '409': { description: 'Email já cadastrado' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autentica um usuário e retorna um token JWT',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } },
        },
        responses: {
          '200': { description: 'Login bem-sucedido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Token' } } } },
          '401': { description: 'Credenciais inválidas' },
        },
      },
    },
    '/users/me': {
      get: {
        tags: ['Usuários'],
        summary: 'Retorna as informações do usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          '401': { description: 'Não autorizado' },
        },
      },
    },
    '/datasets/upload': {
      post: {
        tags: ['Datasets'],
        summary: 'Faz upload de um novo arquivo de dataset (.csv ou .pdf)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
            },
          },
        },
        responses: {
          '201': { description: 'Arquivo enviado e processado' },
          '400': { description: 'Arquivo não enviado ou tipo inválido' },
        },
      },
    },
    '/datasets': {
      get: {
        tags: ['Datasets'],
        summary: 'Lista todos os datasets do usuário',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Sucesso' } },
      },
    },
    '/datasets/{id}/records': {
      get: {
        tags: ['Datasets'],
        summary: 'Lista todos os registros de um dataset específico',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Sucesso' },
          '404': { description: 'Dataset não encontrado' },
        },
      },
    },
    '/records/search': {
      get: {
        tags: ['Records'],
        summary: 'Busca textual por palavra-chave nos registros',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'query', name: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Sucesso' },
          '400': { description: 'Parâmetro "query" obrigatório' },
        },
      },
    },
    '/queries': {
      get: {
        tags: ['IA Mock'],
        summary: 'Retorna o histórico de perguntas do usuário',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Sucesso' } },
      },
      post: {
        tags: ['IA Mock'],
        summary: 'Submete uma pergunta para a IA Mock',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/NewQuery' } } },
        },
        responses: { '201': { description: 'Pergunta registrada' } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      User: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, email: { type: 'string' } } },
      NewUser: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } },
      Login: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } },
      Token: { type: 'object', properties: { message: { type: 'string' }, token: { type: 'string' } } },
      NewQuery: { type: 'object', properties: { pergunta: { type: 'string' }, datasetId: { type: 'string' } } },
    },
  },
};