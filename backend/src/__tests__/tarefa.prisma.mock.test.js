import request from 'supertest';
import { jest } from '@jest/globals';

// ESM-aware mock
const mTask = {
  findMany: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({ id: 1, title: 'Criada', description: '', completed: false }),
  update: jest.fn().mockResolvedValue({ id: 1, title: 'Atualizada', completed: true }),
  delete: jest.fn().mockResolvedValue({}),
};

jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({ task: mTask })),
}));

let app;

beforeAll(async () => {
  const mod = await import('../app.js');
  app = mod.default;
});

describe('Rotas com Prisma mockado', () => {
  test('POST /tarefas cria e retorna 201', async () => {
    const res = await request(app).post('/tarefas').send({ titulo: 'Teste', descricao: 'desc' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Criada');
  });

  test('PUT /tarefas/:id atualiza e retorna 200', async () => {
    const res = await request(app).put('/tarefas/1').send({ titulo: 'Novo', concluida: true });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Atualizada');
  });
});
