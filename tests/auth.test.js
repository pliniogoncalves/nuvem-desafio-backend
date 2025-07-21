import request from 'supertest';
const appUrl = 'http://localhost:3000';

const testUser = {
    name: 'Usuario de Teste',
    email: `teste-${Date.now()}@email.com`,
    password: 'password123',
};
let authToken;

describe('Fluxo de Autenticação e Rota Protegida', () => {

    it('POST /auth/register - Deve registrar um novo usuário com sucesso', async () => {
        const response = await request(appUrl)
            .post('/auth/register')
            .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.email).toBe(testUser.email);
    });

    it('POST /auth/login - Deve autenticar o novo usuário e retornar um token', async () => {
        const credentials = {
            email: testUser.email,
            password: testUser.password,
        };

        const response = await request(appUrl)
            .post('/auth/login')
            .send(credentials);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        
        authToken = response.body.token;
    });

    it('GET /users/me - Deve FALHAR ao tentar acessar uma rota protegida sem um token', async () => {
        const response = await request(appUrl)
            .get('/users/me');

        expect(response.status).toBe(401);
    });

    it('GET /users/me - Deve ACESSAR a rota protegida com o token e retornar os dados do usuário', async () => {
        const response = await request(appUrl)
            .get('/users/me')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email', testUser.email);
    });
});