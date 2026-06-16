export default function Header() {
  return (
    <header className="w-full py-4 px-6 flex items-center bg-transparent relative">
      <div className="flex items-center gap-3 z-20">
        <div aria-hidden className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'radial-gradient(circle at 30% 30%, #FFD800 0%, #FFC700 60%)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
          </svg>
        </div>
        <a href="/" className="text-xl font-extrabold" style={{ color: '#FFD800', letterSpacing: '-0.5px' }}>Tarefas Pro</a>
      </div>

      <nav aria-label="main navigation" className="hidden md:flex items-center gap-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <a href="#" className="text-slate-200 hover:text-white text-sm">Início</a>
        <a href="#" className="text-slate-200 hover:text-white text-sm">Sobre</a>
        <a href="#" className="text-slate-200 hover:text-white text-sm">Contato</a>
      </nav>

      <div className="ml-4 z-20">
        <button aria-label="Nova tarefa" className="px-4 py-2 rounded-lg text-sm shadow-md focus:outline-none" style={{ backgroundColor: '#FFD800', color: '#04162a' }}>+ Nova</button>
      </div>
    </header>
  );
}