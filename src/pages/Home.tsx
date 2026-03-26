export default function Home() {
  return (
    <div>
      <h1 className="text-5xl mb-6">Hi! I'm Joshua, also known as @Antawoo online.</h1>
      
      <p className="text-xl mb-12 leading-relaxed">
        Welcome to my tiny corner of the internet.<br />
        I make small apps, tools, and Unity WebGL games for fun.
      </p>

      <div className="space-y-8 text-lg">
        <p>
          <a href="/games" className="text-sky-400 hover:underline">
            Games
          </a> — playable Unity experiments I've built
        </p>
        <p>
          <a href="/apps" className="text-sky-400 hover:underline">
            Apps & Tools
          </a> — small web utilities and mini-projects
        </p>
        <p>
          <a href="/about" className="text-sky-400 hover:underline">
            About
          </a>
        </p>

      </div>
    </div>
  );
}