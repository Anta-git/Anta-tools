import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 py-6">
      <div className="max-w-2xl mx-auto px-6 flex gap-8 text-lg">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/about" className="hover:text-white transition-colors">About</Link>
      </div>
    </nav>
  );
}