let tarefas = [];
let proximoId = 1;

export function obterTarefas() {
  return tarefas;
}

export function adicionarTarefa(titulo) {
  const novaTarefa = {
    id: proximoId++,
    titulo,
    concluida: false
  };
  tarefas.push(novaTarefa);
  return novaTarefa;
}
