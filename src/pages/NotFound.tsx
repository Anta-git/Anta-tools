// Catch-all page for unknown routes.
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-4">404 — Page Not Found</h1>
      <p className="text-zinc-400 mb-8">
        That page doesn't exist (or is one of the broken ones).
      </p>
      <Link
        to="/"
        className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
      >
        ← Back home
      </Link>
    </div>
  );
}
