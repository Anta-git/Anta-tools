import { Link } from 'react-router-dom';

// Games open in a new tab so the player doesn't lose their place on the site.
export default function Games() {
  return (
    <div>
      <h2 className="text-3xl mb-8">Games</h2>
      <p className="mb-8">Here are the small Unity WebGL games I've made.</p>

      <div className="space-y-8 text-lg">
        <div>
          <Link
            to="/games/horror-game"
            className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
          >
            Horror Game Concept
          </Link>
          <p className="text-sm text-zinc-500 mt-1">
            Small concept for a horror idle game.
          </p>
        </div>
      </div>
    </div>
  );
}
