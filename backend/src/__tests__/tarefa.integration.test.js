import { jest } from '@jest/globals';

// Ensure a test sqlite DB is used if none provided
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db';

import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app.js';

const prisma = new PrismaClient();

beforeAll(async () => {
  // run migrations deployed by pretest script or CI; ensure tables exist
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Integração real com DB (SQLite)', () => {
  test('Criar, listar e deletar tarefa', async () => {
    // Criar
    const post = await request(app).post('/tarefas').send({ titulo: 'integ-test', descricao: 'desc' });
    expect(post.status).toBe(201);
    const id = post.body.id;

    // Listar
    const list = await request(app).get('/tarefas');
    expect(list.status).toBe(200);
    const found = list.body.find((t) => t.id === id);
    expect(found).toBeDefined();

    // Deletar
    const del = await request(app).delete(`/tarefas/${id}`);
    expect(del.status).toBe(200);
  });
});
