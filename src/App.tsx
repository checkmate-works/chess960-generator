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
  const positionId = calculatePositionId(position);
  const [inputValue, setInputValue] = useState<string>(String(positionId));
  const { theme, toggleTheme } = useTheme();

  const handleGenerate = () => {
    const newPosition = generatePosition();
    setPosition(newPosition);
    setInputValue(String(calculatePositionId(newPosition)));
  };

  const fen = positionToFen(position);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);

    const value = parseInt(rawValue, 10);
    if (!isNaN(value) && value >= 0 && value <= 959) {
      setPosition(positionFromId(value));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-md">
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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={handleIdChange}
              className="w-20 px-2 py-1 text-center font-mono font-semibold bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100 rounded border border-stone-300 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <footer className="pt-4 flex flex-col items-center gap-2">
          <a
            href="https://www.blindfold-chess.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors inline-flex items-center gap-1.5"
          >
            <span>🙈</span>
            <span>Blindfold Chess Practice</span>
          </a>
          <a
            href="https://github.com/checkmate-works/chess960-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors inline-flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Free & Open Source</span>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
