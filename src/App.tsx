import { Routes, Route } from 'react-router-dom';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { TarotPage } from './pages/TarotPage';
import { DivinationPage } from './pages/DivinationPage';

function App() {
  return (
    <div className="min-h-screen text-slate-100 selection:bg-cyan-500/30 flex flex-col">
      <Background />
      <Header />

      <main className="flex-grow container mx-auto px-4 pt-12 pb-24 max-w-5xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tarot" element={<TarotPage />} />
          <Route path="/divination" element={<DivinationPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
