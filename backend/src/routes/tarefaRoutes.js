// ========================================
// ROUTES - CAMADA DE ROTAS
// ========================================
// Esta camada é responsável por:
// - Definir as rotas da aplicação
// - Mapear URLs para os controllers correspondentes
// - Organizar as rotas por recurso/entidade

import express from "express";
import TarefaController from "../controllers/tarefaController.js"; // 👈 AJUSTADO: Importação limpa para bater com o export default
import {
	validateCreate,
	validateUpdate,
	handleValidation,
} from "../middlewares/validators/tarefaValidators.js";

// Cria um roteador do Express
const router = express.Router();

// ========================================
// DEFINIÇÃO DAS ROTAS DE TAREFAS
// ========================================

/**
 * GET /tarefas - Lista todas as tarefas
 */
router.get("/tarefas", TarefaController.listar);

/**
 * GET /tarefas/:id - Busca uma tarefa específica pelo ID
 */
router.get("/tarefas/:id", TarefaController.buscarPorId); // 👈 AJUSTADO: Mudado de .patch para .get que é o correto para buscar

/**
 * POST /tarefas - Cria uma nova tarefa
 */
router.post(
	"/tarefas",
	validateCreate,
	handleValidation,
	TarefaController.criar
);

/**
 * PUT /tarefas/:id - Atualiza uma tarefa
 */
router.put(
	"/tarefas/:id",
	validateUpdate,
	handleValidation,
	TarefaController.atualizar
);

/**
 * DELETE /tarefas/:id - Exclui uma tarefa
 */
router.delete("/tarefas/:id", TarefaController.excluir);

// Exporta o roteador para ser usado no app principal
export default router;