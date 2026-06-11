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
import Weather from "./pages/apps/Weather";
import HorrorGame from "./pages/games/HorrorGame";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-200">
      <Navbar />

      {/* Each page declares its own width container — narrow text pages
          use max-w-2xl while visualization pages need max-w-4xl. */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/sorting" element={<Sorting />} />
          <Route path="/apps/grid-battle" element={<GridBattle />} />
          <Route path="/apps/weather" element={<Weather />} />
          <Route path="/games/horror-game" element={<HorrorGame />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
