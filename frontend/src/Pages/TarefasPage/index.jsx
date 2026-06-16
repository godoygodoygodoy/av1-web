import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Toast from '../../components/Toast/Toast';

export default function TaskFlow() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [textoEditando, setTextoEditando] = useState('');

  // Aponta para a porta 3000 do seu Backend
  const API_URL = 'http://localhost:3000/tarefas';

  // 1. LISTAR TAREFAS (GET)
  const carregarTarefas = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar dados do backend.');
      const dados = await response.json();
      
      // Garante que o estado receba um array
      setTarefas(Array.isArray(dados) ? dados : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  // 2. CRIAR TAREFA (POST)
  const adicionarTarefa = async (e) => {
    e.preventDefault();
    if (!novaTarefa.trim()) {
      // mensagem simples de validação
      alert('Digite o título da tarefa antes de salvar.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: novaTarefa, // O controller vai traduzir isso para 'title'
          descricao: ""
        }),
      });

      if (!response.ok) throw new Error('Erro ao adicionar tarefa.');
      
      setNovaTarefa('');
      carregarTarefas(); // Atualiza a lista automaticamente
      setToast('Tarefa criada com sucesso!');
      setTimeout(() => setToast(''), 2500);
    } catch (err) {
      setToast(err.message || 'Erro desconhecido');
      setTimeout(() => setToast(''), 2500);
    }
  };

  // 3. ALTERAR STATUS (CONCLUÍDA / PENDENTE)
  const alternarConclusao = async (id, tituloAtual, statusAtual) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: tituloAtual,
          concluida: !statusAtual,
        }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar status.');
      carregarTarefas();
    } catch (err) {
      alert(err.message);
    }
  };

  // 4. DELETAR TAREFA (DELETE)
  const deletarTarefa = async (id) => {
    if (!confirm('Deseja realmente excluir esta tarefa?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir tarefa.');
      carregarTarefas();
      setToast('Tarefa excluída');
      setTimeout(() => setToast(''), 2500);
    } catch (err) {
      setToast(err.message || 'Erro desconhecido');
      setTimeout(() => setToast(''), 2500);
    }
  };

  // 5. SALVAR EDIÇÃO DE TEXTO
  const salvarEdicao = async (id, statusAtual) => {
    if (!textoEditando.trim()) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: textoEditando,
          concluida: statusAtual,
        }),
      });

      if (!response.ok) throw new Error('Erro ao editar tarefa.');
      
      setEditandoId(null);
      setTextoEditando('');
      carregarTarefas();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center p-6 font-sans relative">
      <Header />
      <Toast message={toast} />

      <main className="w-full max-w-3xl p-6 rounded-3xl shadow-2xl mt-10 z-10" style={{ background: 'rgba(0,8,20,0.6)', border: '1px solid #0033A9' }}>
        
        <h1 className="text-3xl font-extrabold text-center mb-2 pacman-font" style={{ color: '#FFD800' }}>Lista de Tarefas</h1>
        <p className="text-center text-sm mb-6" style={{ color: '#9FCBF7' }}>Cadastre tarefas no frontend e visualize no MySQL.</p>

        {/* FORMULÁRIO DE CADASTRO */}
        <form onSubmit={adicionarTarefa} className="flex gap-2 mb-6" aria-label="Adicionar tarefa">
          <input
            type="text"
            className="flex-1 rounded-xl px-4 py-3 text-slate-100 focus:outline-none transition-colors placeholder-slate-500"
            style={{ background: 'rgba(2,6,23,0.7)', border: '1px solid #0033A9' }}
            placeholder="Digite uma nova tarefa..."
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
          />
          <button
            type="submit"
            disabled={!novaTarefa.trim()}
            className={`font-bold px-6 rounded-xl transition-all active:scale-95 ${!novaTarefa.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: '#FFD800', color: '#04162a', boxShadow: '0 8px 24px rgba(255,216,0,0.12)' }}
          >
            Salvar
          </button>
        </form>

        {/* CONTAINER DE TAREFAS */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,6,18,0.55)', border: '1px solid #001f54' }}>
          <div className="flex justify-between items-center border-b pb-3 mb-4" style={{ borderColor: '#001f54' }}>
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9FCBF7' }}>Tarefas Cadastradas</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full pacman-font" style={{ background: '#FFD800', color: '#04162a' }}>{tarefas.length}</span>
          </div>

          {/* STATUS DA REQUISIÇÃO */}
          {loading && <p className="text-center text-slate-500 py-4 text-sm animate-pulse">Carregando tarefas...</p>}
          
          {error && (
            <div className="flex items-center justify-center gap-2 bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl p-4 my-2 text-sm">
              <span>⚠️ Erro: Conecte o Backend primeiro ({error})</span>
            </div>
          )}

          {/* LISTA DE TAREFAS */}
          {!loading && !error && tarefas.length === 0 && (
            <p className="text-center text-slate-600 py-6 text-sm">Nenhuma tarefa encontrada. Comece adicionando uma!</p>
          )}

          <ul className="space-y-2">
            {tarefas.map((tarefa) => (
              <li key={tarefa.id} className="flex items-center justify-between p-3 rounded-lg transition-colors group" style={{ background: 'rgba(0,6,12,0.6)', border: '1px solid rgba(2,18,50,0.6)' }}>
                <div className="flex items-center gap-3 flex-1 mr-4">
                  {/* Checkbox baseado em 'completed' (inglês do banco) */}
                  <button
                    onClick={() => alternarConclusao(tarefa.id, tarefa.title, tarefa.completed)}
                    aria-pressed={tarefa.completed}
                    title={tarefa.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                    style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    <svg width="28" height="28" viewBox="0 0 8 8" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
                      {/* Pac-Man pixel art (8x8) */}
                      <rect x="2" y="0" width="1" height="1" fill="#FFD800" />
                      <rect x="3" y="0" width="1" height="1" fill="#FFD800" />
                      <rect x="4" y="0" width="1" height="1" fill="#FFD800" />

                      <rect x="1" y="1" width="1" height="1" fill="#FFD800" />
                      <rect x="2" y="1" width="1" height="1" fill="#FFD800" />
                      <rect x="3" y="1" width="1" height="1" fill="#FFD800" />
                      <rect x="4" y="1" width="1" height="1" fill="#FFD800" />
                      <rect x="5" y="1" width="1" height="1" fill="#FFD800" />

                      <rect x="0" y="2" width="1" height="1" fill="#FFD800" />
                      <rect x="1" y="2" width="1" height="1" fill="#FFD800" />
                      <rect x="2" y="2" width="1" height="1" fill="#FFD800" />
                      <rect x="3" y="2" width="1" height="1" fill="#FFD800" />
                      <rect x="4" y="2" width="1" height="1" fill="#FFD800" />
                      <rect x="5" y="2" width="1" height="1" fill="#FFD800" />
                      <rect x="6" y="2" width="1" height="1" fill="#FFD800" />

                      <rect x="0" y="3" width="1" height="1" fill="#FFD800" />
                      <rect x="1" y="3" width="1" height="1" fill="#FFD800" />
                      <rect x="2" y="3" width="1" height="1" fill="#FFD800" />
                      <rect x="3" y="3" width="1" height="1" fill="#000814" />
                      <rect x="4" y="3" width="1" height="1" fill="#FFD800" />
                      <rect x="5" y="3" width="1" height="1" fill="#FFD800" />
                      <rect x="6" y="3" width="1" height="1" fill="#FFD800" />

                      <rect x="0" y="4" width="1" height="1" fill="#FFD800" />
                      <rect x="1" y="4" width="1" height="1" fill="#FFD800" />
                      <rect x="2" y="4" width="1" height="1" fill="#FFD800" />
                      <rect x="3" y="4" width="1" height="1" fill="#FFD800" />
                      <rect x="4" y="4" width="1" height="1" fill="#FFD800" />
                      <rect x="5" y="4" width="1" height="1" fill="#FFD800" />
                      <rect x="6" y="4" width="1" height="1" fill="#FFD800" />

                      <rect x="0" y="5" width="1" height="1" fill="#FFD800" />
                      <rect x="1" y="5" width="1" height="1" fill="#FFD800" />
                      <rect x="2" y="5" width="1" height="1" fill="#FFD800" />
                      <rect x="3" y="5" width="1" height="1" fill="#FFD800" />
                      <rect x="4" y="5" width="1" height="1" fill="#FFD800" />
                      <rect x="5" y="5" width="1" height="1" fill="#FFD800" />

                      <rect x="1" y="6" width="1" height="1" fill="#FFD800" />
                      <rect x="2" y="6" width="1" height="1" fill="#FFD800" />
                      <rect x="3" y="6" width="1" height="1" fill="#FFD800" />
                      <rect x="4" y="6" width="1" height="1" fill="#FFD800" />
                      <rect x="5" y="6" width="1" height="1" fill="#FFD800" />

                      {/* Olho quando não concluída */}
                      {!tarefa.completed && <rect x="5" y="2" width="1" height="1" fill="#04162a" />}

                    </svg>
                  </button>

                  {editandoId === tarefa.id ? (
                    <input
                      type="text"
                      className="flex-1 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none"
                      style={{ background: 'rgba(2,6,23,0.7)', border: '1px solid #0033A9' }}
                      value={textoEditando}
                      onChange={(e) => setTextoEditando(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && salvarEdicao(tarefa.id, tarefa.completed)}
                    />
                  ) : (
                    // Exibe o texto vindo de 'title' (inglês do banco)
                    <span className={`text-sm transition-all ${tarefa.completed ? 'line-through' : ''}`} style={{ color: tarefa.completed ? '#6b7280' : '#E6F7FF' }}>
                      {tarefa.title}
                    </span>
                  )}
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="flex items-center gap-1">
                  {editandoId === tarefa.id ? (
                    <button onClick={() => salvarEdicao(tarefa.id, tarefa.completed)} className="text-xs px-2.5 py-1.5 rounded font-medium transition-colors" style={{ background: 'rgba(24,255,255,0.08)', color: '#00e5ff' }}>
                      Salvar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditandoId(tarefa.id);
                        setTextoEditando(tarefa.title);
                      }}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded font-medium transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      Editar
                    </button>
                  )}
                    <button onClick={() => deletarTarefa(tarefa.id)} className="text-xs px-2.5 py-1.5 rounded font-medium transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" style={{ background: 'rgba(255,23,68,0.06)', color: '#ff4060' }}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </main>
    </div>
  );
}