/**
 * Root layout component.
 *
 * Handles the global page shell (navbar, main content area) and
 * declares every client-side route in one place. Adding a new page means
 * adding a single <Route> entry here and the corresponding page component.
 */
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Games from "./pages/games/Games";
import Apps from "./pages/apps/Apps";
import Sorting from "./pages/apps/Sorting";
import GridBattle from "./pages/apps/GridBattle";
import HorrorGame from "./pages/games/HorrorGame";
import About from "./pages/About";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-200">
      <Navbar />

      {/* All page content renders inside this centered column. */}
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/sorting" element={<Sorting />} />
          <Route path="/apps/grid-battle" element={<GridBattle />} />
          <Route path="/games/horror-game" element={<HorrorGame />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
