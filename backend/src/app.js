import express from "express";
import cors from "cors";
import tarefaRoutes from "./routes/tarefaRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = 3000;

// ========================================
// MIDDLEWARES (Sempre no topo!)
// ========================================

// Libera o acesso para o seu frontend na porta 5173
app.use(cors()); 

// Permite ler os dados enviados em formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// ROTAS
// ========================================

// Vincula todas as rotas de tarefas (/tarefas)
app.use(tarefaRoutes);

// Rota raiz para testes rápidos no navegador
app.get("/", (req, res) => {
  res.json({ mensagem: "API de tarefas funcionando perfeitamente!" });
});

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================
// middleware de erro centralizado (deve vir após as rotas)
app.use(errorHandler);
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando com CORS em http://localhost:${PORT}`);
  });
}

export default app;