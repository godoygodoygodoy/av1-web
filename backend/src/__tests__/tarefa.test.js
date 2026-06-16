import request from "supertest";
import app from "../app.js";

describe("Rotas básicas e validação", () => {
  test("GET / deve retornar mensagem de status 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("mensagem");
  });

  test("POST /tarefas sem 'titulo' deve retornar 400", async () => {
    const res = await request(app).post("/tarefas").send({ descricao: "teste" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  test("PUT /tarefas/:id com 'concluida' inválida retorna 400", async () => {
    const res = await request(app)
      .put("/tarefas/1")
      .send({ titulo: "abc", concluida: "notabool" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });
});
