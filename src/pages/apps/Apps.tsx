import { Link } from 'react-router-dom';

export default function Apps() {
  return (
    <div>
      <h1 className="text-4xl font-light mb-6">Apps & Tools</h1>
      <p className="text-zinc-400 mb-10">
        Small interactive web tools and experiments I've built.
      </p>

      <div className="space-y-8 text-lg">
        <div>
          <Link 
            to="/apps/sorting" 
            className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
          >
            Sorting Visuals
          </Link>
          <p className="text-sm text-zinc-500 mt-1">
            Interactive visualizations of sorting algorithms (Bubble Sort + more coming)
          </p>
        </div>

        <div>
          <Link
            to="/apps/grid-battle"
            className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
          >
            Grid Battle
          </Link>
          <p className="text-sm text-zinc-500 mt-1">
            Four algorithms compete to claim the most territory on a grid
          </p>
        </div>
      </div>
    </div>
  );
}