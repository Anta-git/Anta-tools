// Games listing page — each game links to its hosted Unity WebGL build.
// Games open in a new tab so the player doesn't lose their place on the site.
export default function Games() {
  return (
    <div>
      <h2 className="text-3xl mb-8">Games</h2>
      <p className="mb-8">Here are the small Unity WebGL games I've made.</p>

      <div className="space-y-6 text-lg">
        {/* Example — replace with real games later */}
        <p>
          <a href="/games/my-first-game/" target="_blank" rel="noopener" className="text-sky-400 hover:underline">
            My First Game — short description here
          </a>
        </p>
      </div>
    </div>
  );
}