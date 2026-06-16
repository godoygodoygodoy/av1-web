import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TarefaController = {
  // 1. LISTAR TAREFAS (GET)
  listar: async (req, res) => {
    try {
      const tarefas = await prisma.task.findMany({
        include: { category: true }
      });
      // Try to parse JSON descriptions so frontend receives structured data when available
      const processed = tarefas.map(t => {
        let desc = t.description;
        try {
          if (typeof desc === 'string') {
            const parsed = JSON.parse(desc);
            desc = parsed;
          }
        } catch (e) {
          // leave as string
        }
        return { ...t, description: desc };
      });
      res.json(processed);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 2. BUSCAR POR ID (GET /tarefas/:id) - 👈 ADICIONADO PARA CORRIGIR O CRASH
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const tarefa = await prisma.task.findUnique({
        where: { id: Number(id) },
        include: { category: true }
      });

      if (!tarefa) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
      }

      res.json(tarefa);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 3. CRIAR TAREFA (POST)
  criar: async (req, res) => {
    try {
      const { titulo, descricao } = req.body;
      // If descricao is object, stringify to persist in the string field
      const descriptionToStore = (descricao && typeof descricao === 'object') ? JSON.stringify(descricao) : (descricao || "");
      const novaTarefa = await prisma.task.create({
        data: {
          title: titulo,
          description: descriptionToStore,
          completed: false
        }
      });
      // Return parsed description when possible
      let returnedDesc = novaTarefa.description;
      try { returnedDesc = JSON.parse(returnedDesc); } catch (e) {}
      const returned = { ...novaTarefa, description: returnedDesc };
      res.status(201).json(novaTarefa);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 4. ATUALIZAR TAREFA (PUT)
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, concluida, descricao } = req.body;
      const dataToUpdate = { title: titulo, completed: concluida };
      if (descricao !== undefined) {
        dataToUpdate.description = (typeof descricao === 'object') ? JSON.stringify(descricao) : descricao;
      }
      const tarefaAtualizada = await prisma.task.update({
        where: { id: Number(id) },
        data: dataToUpdate
      });
      let returnedDesc = tarefaAtualizada.description;
      try { returnedDesc = JSON.parse(returnedDesc); } catch (e) {}
      res.json({ ...tarefaAtualizada, description: returnedDesc });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 5. EXCLUIR TAREFA (DELETE)
  excluir: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.task.delete({
        where: { id: Number(id) }
      });
      res.json({ mensagem: "Tarefa excluída!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Exportação padrão para bater com o seu router
export default TarefaController;