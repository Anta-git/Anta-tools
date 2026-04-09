/** Metadata for a hosted Unity WebGL game shown on the Games page. */
export interface Game {
  id: string;
  title: string;
  description: string;
  tech: string[];
  url: string;       // relative path to the hosted build, e.g. "/games/my-game/"
  github?: string;   // optional link to source repo
}