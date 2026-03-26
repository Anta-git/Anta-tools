import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Import your page components (create these files next)
import Home from './pages/Home';
import Games from './pages/Games';
import Apps from './pages/Apps';
import About from './pages/About';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-light">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;