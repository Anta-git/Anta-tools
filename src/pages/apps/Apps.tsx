// Index page for the Apps section — serves as a directory of all
// interactive web tools. Each entry links to its dedicated page.
import { Link } from 'react-router-dom';

const apps = [
  {
    to: '/apps/sorting',
    title: 'Sorting Visuals',
    description:
      'Interactive visualizations of sorting algorithms, with sound (Bubble Sort, Heap Sort)',
  },
  {
    to: '/apps/grid-battle',
    title: 'Grid Battle',
    description:
      'Four algorithms compete to claim the most territory on a grid',
  },
  {
    to: '/apps/weather',
    title: 'Missouri Weather',
    description:
      'Live current conditions for cities across Missouri via the Open-Meteo API',
  },
];

export default function Apps() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-6">Apps & Tools</h1>
      <p className="text-zinc-400 mb-10">
        Small interactive web tools and experiments I've built.
      </p>

      <div className="space-y-8 text-lg">
        {apps.map(({ to, title, description }) => (
          <div key={to}>
            <Link
              to={to}
              className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
            >
              {title}
            </Link>
            <p className="text-sm text-zinc-500 mt-1">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
