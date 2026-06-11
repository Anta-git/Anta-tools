// Index page for the Games section — a directory of playable games.
import { Link } from 'react-router-dom';

export default function Games() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-6">Games</h1>
      <p className="text-zinc-400 mb-10">
        Small games and game concepts I've made.
      </p>

      <div className="space-y-8 text-lg">
        <div>
          <Link
            to="/games/horror-game"
            className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
          >
            Horror Game Concept
          </Link>
          <p className="text-sm text-zinc-500 mt-1">
            UI mockup for a horror idle game — explore, manage resources,
            decode signals.
          </p>
        </div>
      </div>
    </div>
  );
}
