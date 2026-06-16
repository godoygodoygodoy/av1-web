import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Toast from '../../components/Toast/Toast';
import PacmanButton from '../../components/PacmanButton';

export default function TaskFlow() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [includeDate, setIncludeDate] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const [includePriority, setIncludePriority] = useState(false);
  const [priorityValue, setPriorityValue] = useState('');
  const [includeNotes, setIncludeNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [includeSubtasks, setIncludeSubtasks] = useState(false);
  const [subtaskText, setSubtaskText] = useState('');
  const [subtasks, setSubtasks] = useState([]);
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
      // Build descricao: if user selected extra fields, send an object
      let descricaoPayload = novaTarefa;
      const hasExtras = includeDate || includePriority || includeNotes || includeSubtasks;
      if (hasExtras) {
        descricaoPayload = {
          text: novaTarefa,
          when: includeDate ? dateValue : null,
          priority: includePriority ? priorityValue : null,
          notes: includeNotes ? notesValue : null,
          subtasks: includeSubtasks ? subtasks.slice() : []
        };
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: novaTarefa, // O controller vai traduzir isso para 'title'
          descricao: descricaoPayload
        }),
      });

      if (!response.ok) throw new Error('Erro ao adicionar tarefa.');
      
      setNovaTarefa('');
      // reset extras
      setIncludeDate(false); setDateValue('');
      setIncludePriority(false); setPriorityValue('');
      setIncludeNotes(false); setNotesValue('');
      setIncludeSubtasks(false); setSubtasks([]); setSubtaskText('');
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
        
        <h1 className="text-3xl font-extrabold text-center mb-2 pacmania-font" style={{ color: '#FFD800' }}>Lista de Tarefas</h1>
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

        {/* Optional fields chooser: only show after typing a title */}
        {novaTarefa.trim() ? (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeDate} onChange={(e) => setIncludeDate(e.target.checked)} /> Quando
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includePriority} onChange={(e) => setIncludePriority(e.target.checked)} /> Prioridade
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeNotes} onChange={(e) => setIncludeNotes(e.target.checked)} /> Notas
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeSubtasks} onChange={(e) => setIncludeSubtasks(e.target.checked)} /> Subtarefas
              </label>
            </div>

            {includeDate && (
              <div className="mb-3">
                <input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} className="rounded px-3 py-2" />
              </div>
            )}
            {includePriority && (
              <div className="mb-3">
                <select value={priorityValue} onChange={(e) => setPriorityValue(e.target.value)} className="rounded px-3 py-2">
                  <option value="">-- escolha --</option>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            )}
            {includeNotes && (
              <div className="mb-3">
                <textarea placeholder="Notas adicionais" value={notesValue} onChange={(e) => setNotesValue(e.target.value)} className="w-full rounded px-3 py-2" />
              </div>
            )}
            {includeSubtasks && (
              <div className="mb-3">
                <div className="flex gap-2 mb-2">
                  <input value={subtaskText} onChange={(e) => setSubtaskText(e.target.value)} placeholder="Adicionar subtarefa" className="flex-1 rounded px-3 py-2" />
                  <button onClick={() => { if (subtaskText.trim()) { setSubtasks(s => [...s, { text: subtaskText.trim(), done: false }]); setSubtaskText(''); } }} className="px-3 py-2 rounded bg-slate-800 text-white">Adicionar</button>
                </div>
                <ul className="list-disc pl-5 text-sm">
                  {subtasks.map((st, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span>{st.text}</span>
                      <button onClick={() => setSubtasks(s => s.filter((_, i) => i !== idx))} className="text-xs text-red-400">Remover</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-500 mb-4">Digite o título da tarefa para ver opções adicionais (data, prioridade, notas, subtarefas).</p>
        )}

        {/* CONTAINER DE TAREFAS */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,6,18,0.55)', border: '1px solid #001f54' }}>
          <div className="flex justify-between items-center border-b pb-3 mb-4" style={{ borderColor: '#001f54' }}>
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9FCBF7' }}>Tarefas Cadastradas</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full pacmania-font" style={{ background: '#FFD800', color: '#04162a' }}>{tarefas.length}</span>
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
                  <PacmanButton active={tarefa.completed} onClick={() => alternarConclusao(tarefa.id, tarefa.title, tarefa.completed)} />

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
                    <div>
                      <span className={`text-sm block transition-all ${tarefa.completed ? 'line-through' : ''}`} style={{ color: tarefa.completed ? '#6b7280' : '#E6F7FF' }}>
                        {tarefa.title}
                      </span>
                      {/* show parsed description fields if present */}
                      {tarefa.description && typeof tarefa.description === 'object' && (
                        <div className="text-xs text-slate-400 mt-1">
                          {tarefa.description.when && <div>Quando: {tarefa.description.when}</div>}
                          {tarefa.description.priority && <div>Prioridade: {tarefa.description.priority}</div>}
                          {tarefa.description.notes && <div>Notas: {tarefa.description.notes}</div>}
                          {tarefa.description.subtasks && tarefa.description.subtasks.length > 0 && (
                            <div>Subtarefas:
                              <ul className="pl-4 list-disc">
                                {tarefa.description.subtasks.map((st, i) => (
                                  <li key={i} className={st.done ? 'line-through text-slate-500' : ''}>{st.text}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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