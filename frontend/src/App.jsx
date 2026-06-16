import TarefasPage from "./Pages/TarefasPage";
import InteractiveBackground from "./components/InteractiveBackground";

export default function App() {
  return (
    <div className="min-h-screen p-8 relative overflow-hidden" style={{ backgroundColor: '#000814', color: '#FFEAA7' }}>
      <InteractiveBackground />
      <TarefasPage />
    </div>
  );
}