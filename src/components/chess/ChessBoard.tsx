import { useMemo } from 'react';
import { Chess, type Color, type PieceSymbol, type Square as SquareType } from 'chess.js';

import { ChessPiece } from './ChessPiece';
import { Square } from './Square';
import type { BoardTheme } from '../../lib/boardThemes';
import { getBoardThemeColors } from '../../lib/boardThemes';

type BoardPiece = {
  square: SquareType;
  type: PieceSymbol;
  color: Color;
} | null;

type Props = {
  fen: string;
  flipped?: boolean;
  showCoordinates?: boolean;
  boardTheme?: BoardTheme;
  rounded?: boolean;
  className?: string;
};

export function ChessBoard({
  fen,
  flipped = false,
  showCoordinates = true,
  boardTheme = 'lichess',
  rounded = true,
  className = '',
}: Props) {
  const themeColors = getBoardThemeColors(boardTheme);

  const board = useMemo(() => {
    try {
      const chess = new Chess(fen);
      return chess.board();
    } catch (error) {
      console.error('Invalid FEN:', error);
      return Array(8)
        .fill(null)
        .map(() => Array(8).fill(null)) as BoardPiece[][];
    }
  }, [fen]);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const renderPiece = (piece: BoardPiece) => {
    if (!piece) return null;

    return (
      <div className="w-[80%] h-[80%] flex items-center justify-center">
        <ChessPiece type={piece.type} color={piece.color} size={45} />
      </div>
    );
  };

  const isLightSquare = (file: number, rank: number) => {
    return (file + rank) % 2 === 0;
  };

  const displayBoard = useMemo(() => {
    if (flipped) {
      return board
        .slice()
        .reverse()
        .map((row) => row.slice().reverse());
    }
    return board;
  }, [board, flipped]);

  const displayFiles = flipped ? files.slice().reverse() : files;
  const displayRanks = flipped ? ranks.slice().reverse() : ranks;

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative w-full aspect-square border border-stone-400 overflow-hidden ${rounded ? 'rounded-md shadow-lg' : ''}`}
      >
        {displayBoard.map((row, rankIndex) => (
          <div key={rankIndex} className="flex h-[12.5%]">
            {row.map((piece, fileIndex) => {
              const actualRankIndex = flipped ? 7 - rankIndex : rankIndex;
              const actualFileIndex = flipped ? 7 - fileIndex : fileIndex;
              const isLight = isLightSquare(actualFileIndex, actualRankIndex);

              return (
                <Square
                  key={fileIndex}
                  file={displayFiles[fileIndex]}
                  rank={displayRanks[rankIndex]}
                  isLight={isLight}
                  showCoordinates={showCoordinates}
                  showRankCoordinate={fileIndex === 0}
                  showFileCoordinate={rankIndex === 7}
                  themeColors={themeColors}
                >
                  {renderPiece(piece)}
                </Square>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
