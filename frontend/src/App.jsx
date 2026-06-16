import TarefasPage from "./Pages/TarefasPage";
import InteractiveBackground from "./components/InteractiveBackground";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 p-8 relative overflow-hidden">
      <InteractiveBackground />
      <TarefasPage />
    </div>
  );
}