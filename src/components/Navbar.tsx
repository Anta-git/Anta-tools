// Site-wide navigation bar. Kept intentionally minimal — just a
// horizontal list of top-level page links. NavLink highlights the
// link for the section currently being viewed.
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/games', label: 'Games' },
  { to: '/apps', label: 'Apps' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 py-6 bg-zinc-950">
      <div className="max-w-2xl mx-auto px-6 flex gap-8 text-lg">
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `transition-colors ${isActive ? 'text-white' : 'hover:text-white'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
