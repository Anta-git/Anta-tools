import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-light tracking-tight mb-6">
        Hi! I'm Joshua, also known as @Antawoo online.
      </h1>

      <p className="text-xl mb-12 text-zinc-400">
        Welcome to my tiny corner of the internet.
        <br />I make small apps, tools, and Unity WebGL games for fun.
      </p>

      <div className="space-y-8 text-lg">
        <p>
          <Link
            to="/games"
            className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
          >
            Games
          </Link>{" "}
          — playable Unity experiments I've built
        </p>
        <p>
          <Link
            to="/apps"
            className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
          >
            Apps & Tools
          </Link>{" "}
          — small web utilities and mini-projects
        </p>
        <p>
          <Link
            to="/about"
            className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
          >
            About
          </Link>
        </p>
      </div>
    </div>
  );
}
