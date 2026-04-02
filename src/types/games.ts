export interface Game {
  id: string;
  title: string;
  description: string;
  tech: string[];
  url: string;      // e.g. "/games/my-game/"
  github?: string;
}