import express from 'express';
import { obterTarefas, adicionarTarefa } from './dados.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/tarefas', (req, res) => {
  const tarefas = obterTarefas();
  res.status(200).json(tarefas);
});

app.post('/tarefas', (req, res) => {
  const { titulo } = req.body;

  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ erro: 'O campo titulo é obrigatório' });
  }

  const novaTarefa = adicionarTarefa(titulo);
  res.status(201).json(novaTarefa);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
