import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
//todo: import Footer from './components/Footer';

// Import your page components (create these files next)
import Home from './pages/Home';
import Games from './pages/Games';
import Apps from './pages/apps/Apps';
import Sorting from './pages/apps/Sorting';
import GridBattle from './pages/apps/GridBattle';
import About from './pages/About';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-200">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/sorting" element={<Sorting />} />
          <Route path="/apps/grid-battle" element={<GridBattle />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;