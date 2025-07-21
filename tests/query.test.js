import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appUrl = 'http://localhost:3000';

const queryUserData = {
    name: 'Query Tester',
    email: `query-tester-${Date.now()}@email.com`,
    password: 'password123',
};
let authToken;
let testDatasetId;

describe('Fluxo de IA Mock: Criação e Listagem de Queries', () => {

    beforeAll(async () => {
        await request(appUrl).post('/auth/register').send(queryUserData);
        const loginRes = await request(appUrl).post('/auth/login').send({
            email: queryUserData.email,
            password: queryUserData.password,
        });
        authToken = loginRes.body.token;

        const filePath = path.resolve(__dirname, 'test-data.csv');
        const uploadRes = await request(appUrl)
            .post('/datasets/upload')
            .set('Authorization', `Bearer ${authToken}`)
            .attach('file', filePath);
        
        testDatasetId = uploadRes.body.dataset.id;
    });

    it('POST /queries - Deve criar uma nova query com sucesso', async () => {
        const newQuery = {
            pergunta: "Este documento é um contrato?",
            datasetId: testDatasetId,
        };

        const response = await request(appUrl)
            .post('/queries')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newQuery);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.question).toBe(newQuery.pergunta);
        expect(response.body.answer).toContain('cláusulas contratuais');
    });

    it('GET /queries - Deve listar o histórico de queries do usuário', async () => {
        const response = await request(appUrl)
            .get('/queries')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].question).toBe("Este documento é um contrato?");
    });
});