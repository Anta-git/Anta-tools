// About page — short intro plus links. Bio text is still a
// placeholder; swap it out with real details when ready.
export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-6">About Me</h1>

      <div className="space-y-6 text-lg text-zinc-300">
        <p>
          I'm a software developer who likes building small, self-contained
          projects — the kind you can poke at in a browser. This site is where
          I collect them.
        </p>
        <p>
          Everything here is built with React, TypeScript, and Tailwind, and
          deployed on Cloudflare Workers.
        </p>
        <p>
          You can find me on{" "}
          <a
            href="https://github.com/Anta-git"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}