import request from 'supertest';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appUrl = 'http://localhost:3000';

const userData = {
    name: 'Data Tester',
    email: `data-tester-${Date.now()}@email.com`,
    password: 'password123',
};
let authToken;
let createdDatasetId;

describe('Fluxo de Dados: Upload, Listagem e Busca', () => {

    beforeAll(async () => {
        await request(appUrl).post('/auth/register').send(userData);
        const loginRes = await request(appUrl).post('/auth/login').send({
            email: userData.email,
            password: userData.password,
        });
        authToken = loginRes.body.token;
    });

    it('POST /datasets/upload - Deve fazer o upload de um arquivo .csv com sucesso', async () => {
        const filePath = path.resolve(__dirname, 'test-data.csv');
        
        const response = await request(appUrl)
            .post('/datasets/upload')
            .set('Authorization', `Bearer ${authToken}`)
            .attach('file', filePath);

        expect(response.status).toBe(201);
        expect(response.body.dataset).toHaveProperty('id');
        expect(response.body.dataset.name).toBe('test-data.csv');
        
        createdDatasetId = response.body.dataset.id;
    });

    it('POST /datasets/upload - Deve falhar ao tentar fazer upload de um tipo de arquivo não suportado', async () => {
        const wrongFilePath = path.resolve(__dirname, 'test-file.txt');
        fs.writeFileSync(wrongFilePath, 'test content');

        const response = await request(appUrl)
            .post('/datasets/upload')
            .set('Authorization', `Bearer ${authToken}`)
            .attach('file', wrongFilePath);

        expect(response.status).toBe(500);
        
        fs.unlinkSync(wrongFilePath);
    });
    
    it('GET /datasets - Deve listar os datasets do usuário, incluindo o recém-criado', async () => {
        const response = await request(appUrl)
            .get('/datasets')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const foundDataset = response.body.find(d => d.id === createdDatasetId);
        expect(foundDataset).toBeDefined();
    });

    it('GET /datasets/:id/records - Deve listar os registros do dataset enviado', async () => {
        const response = await request(appUrl)
            .get(`/datasets/${createdDatasetId}/records`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].jsonData.product).toBe('Laptop');
    });

    it('GET /records/search - Deve encontrar um registro pela busca textual', async () => {
        const response = await request(appUrl)
            .get(`/records/search?query=Keyboard`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].jsonData.product).toBe('Keyboard');
    });
});