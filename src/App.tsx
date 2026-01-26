import { useState } from 'react';
import {
  generatePosition,
  positionToString,
  positionToFen,
  calculatePositionId,
  positionFromId,
  type Position,
} from './lib/chess960';
import { ChessBoard } from './components/chess';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';

function App() {
  const [position, setPosition] = useState<Position>(generatePosition);
  const { theme, toggleTheme } = useTheme();

  const handleGenerate = () => {
    setPosition(generatePosition());
  };

  const fen = positionToFen(position);
  const positionId = calculatePositionId(position);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 959) {
      setPosition(positionFromId(value));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
            Chess960 Generator
          </h1>
          <button
            onClick={handleGenerate}
            className="mt-2 inline-flex items-center gap-1.5 text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
          >
            <span>Randomize</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.43l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389 5.5 5.5 0 019.201-2.466l.312.311h-2.433a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </header>

        <div className="w-full">
          <ChessBoard fen={fen} showCoordinates={true} boardTheme="lichess" />
        </div>

        <div className="text-center space-y-2">
          <p className="font-mono text-2xl tracking-wider text-stone-800 dark:text-stone-100">
            {positionToString(position)}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-stone-500 dark:text-stone-400">
            <label htmlFor="position-id">Position ID:</label>
            <input
              id="position-id"
              type="number"
              min={0}
              max={959}
              value={positionId}
              onChange={handleIdChange}
              className="w-20 px-2 py-1 text-center font-mono font-semibold bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100 rounded border border-stone-300 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <footer className="pt-4 text-center">
          <a
            href="https://www.blindfold-chess.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors inline-flex items-center gap-1.5"
          >
            <span>🙈</span>
            <span>Blindfold Chess Practice</span>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
