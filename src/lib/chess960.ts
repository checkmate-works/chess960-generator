export type Piece = 'K' | 'Q' | 'R' | 'B' | 'N';

export type Position = [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece];

/**
 * Generate a valid Chess960 starting position
 *
 * Rules:
 * - Bishops must be on opposite colors (one on light, one on dark square)
 * - King must be between the two rooks
 * - White and black have mirrored positions
 */
export function generatePosition(): Position {
  const position: (Piece | null)[] = [null, null, null, null, null, null, null, null];

  // Place first bishop on a light square (indices 0, 2, 4, 6)
  const lightSquares = [0, 2, 4, 6];
  const lightBishopSquare = lightSquares[Math.floor(Math.random() * lightSquares.length)];
  position[lightBishopSquare] = 'B';

  // Place second bishop on a dark square (indices 1, 3, 5, 7)
  const darkSquares = [1, 3, 5, 7];
  const darkBishopSquare = darkSquares[Math.floor(Math.random() * darkSquares.length)];
  position[darkBishopSquare] = 'B';

  // Get remaining empty squares
  const getEmptySquares = () =>
    position.map((p, i) => (p === null ? i : -1)).filter((i) => i !== -1);

  // Place queen on a random empty square
  let emptySquares = getEmptySquares();
  const queenSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  position[queenSquare] = 'Q';

  // Place first knight on a random empty square
  emptySquares = getEmptySquares();
  const knight1Square = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  position[knight1Square] = 'N';

  // Place second knight on a random empty square
  emptySquares = getEmptySquares();
  const knight2Square = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  position[knight2Square] = 'N';

  // Place rook, king, rook on the remaining 3 squares (in order)
  // This ensures the king is always between the two rooks
  emptySquares = getEmptySquares();
  position[emptySquares[0]] = 'R';
  position[emptySquares[1]] = 'K';
  position[emptySquares[2]] = 'R';

  return position as Position;
}

/**
 * Convert position to a human-readable string
 */
export function positionToString(position: Position): string {
  return position.join('');
}

/**
 * Convert Chess960 position to FEN string
 * Creates a full starting position with pawns on rank 2/7
 */
export function positionToFen(position: Position): string {
  // Black pieces (lowercase) on rank 8
  const blackBackRank = position.map((p) => p.toLowerCase()).join('');

  // Black pawns on rank 7
  const blackPawns = 'pppppppp';

  // Empty ranks 3-6
  const emptyRank = '8';

  // White pawns on rank 2
  const whitePawns = 'PPPPPPPP';

  // White pieces (uppercase) on rank 1
  const whiteBackRank = position.join('');

  // Combine all ranks
  const boardPart = [
    blackBackRank,
    blackPawns,
    emptyRank,
    emptyRank,
    emptyRank,
    emptyRank,
    whitePawns,
    whiteBackRank,
  ].join('/');

  // FEN: board, active color, castling, en passant, halfmove, fullmove
  // For Chess960, we use KQkq for castling rights (simplified)
  return `${boardPart} w KQkq - 0 1`;
}

/**
 * Knight placement combination table
 * Maps two knight positions (from 5 remaining squares) to index 0-9
 */
const KNIGHT_TABLE: Record<string, number> = {
  '0,1': 0,
  '0,2': 1,
  '0,3': 2,
  '0,4': 3,
  '1,2': 4,
  '1,3': 5,
  '1,4': 6,
  '2,3': 7,
  '2,4': 8,
  '3,4': 9,
};

/**
 * Calculate Chess960 Position ID (0-959)
 *
 * The ID is calculated using the following formula:
 * ID = 96*N + 16*Q + 4*D + L
 *
 * Where:
 * - L: Light-squared bishop index (0-3) on squares b1,d1,f1,h1 (indices 1,3,5,7)
 * - D: Dark-squared bishop index (0-3) on squares a1,c1,e1,g1 (indices 0,2,4,6)
 * - Q: Queen index (0-5) on remaining 6 squares after bishops
 * - N: Knight combination index (0-9) on remaining 5 squares after bishops and queen
 */
export function calculatePositionId(position: Position): number {
  // Find bishop positions
  const bishopIndices = position
    .map((piece, index) => (piece === 'B' ? index : -1))
    .filter((i) => i !== -1);

  // Light squares are odd indices (1,3,5,7 = b1,d1,f1,h1)
  // Dark squares are even indices (0,2,4,6 = a1,c1,e1,g1)
  const lightBishopPos = bishopIndices.find((i) => i % 2 === 1)!;
  const darkBishopPos = bishopIndices.find((i) => i % 2 === 0)!;

  // Convert to 0-3 index
  const L = (lightBishopPos - 1) / 2; // 1,3,5,7 -> 0,1,2,3
  const D = darkBishopPos / 2; // 0,2,4,6 -> 0,1,2,3

  // Find remaining squares after bishops
  const afterBishops = [0, 1, 2, 3, 4, 5, 6, 7].filter(
    (i) => i !== lightBishopPos && i !== darkBishopPos
  );

  // Find queen position and its index in remaining squares
  const queenPos = position.findIndex((piece) => piece === 'Q');
  const Q = afterBishops.indexOf(queenPos);

  // Find remaining squares after bishops and queen
  const afterQueen = afterBishops.filter((i) => i !== queenPos);

  // Find knight positions and their indices in remaining squares
  const knightPositions = position
    .map((piece, index) => (piece === 'N' ? index : -1))
    .filter((i) => i !== -1);

  const knightIndices = knightPositions
    .map((pos) => afterQueen.indexOf(pos))
    .sort((a, b) => a - b);

  const N = KNIGHT_TABLE[`${knightIndices[0]},${knightIndices[1]}`];

  return 96 * N + 16 * Q + 4 * D + L;
}

/**
 * Reverse knight table: index (0-9) -> [pos1, pos2] in remaining 5 squares
 */
const KNIGHT_TABLE_REVERSE: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4],
];

/**
 * Generate Chess960 position from Position ID (0-959)
 *
 * Reverses the calculation:
 * - L = ID % 4
 * - D = (ID / 4) % 4
 * - Q = (ID / 16) % 6
 * - N = ID / 96
 */
export function positionFromId(id: number): Position {
  if (id < 0 || id > 959 || !Number.isInteger(id)) {
    throw new Error('Position ID must be an integer between 0 and 959');
  }

  const position: (Piece | null)[] = [null, null, null, null, null, null, null, null];

  // Extract indices from ID
  const L = id % 4;
  const D = Math.floor(id / 4) % 4;
  const Q = Math.floor(id / 16) % 6;
  const N = Math.floor(id / 96);

  // Place light-squared bishop (L: 0-3 -> positions 1,3,5,7)
  const lightBishopPos = L * 2 + 1;
  position[lightBishopPos] = 'B';

  // Place dark-squared bishop (D: 0-3 -> positions 0,2,4,6)
  const darkBishopPos = D * 2;
  position[darkBishopPos] = 'B';

  // Get remaining 6 squares after bishops
  const afterBishops = [0, 1, 2, 3, 4, 5, 6, 7].filter(
    (i) => i !== lightBishopPos && i !== darkBishopPos
  );

  // Place queen at Q-th position in remaining squares
  const queenPos = afterBishops[Q];
  position[queenPos] = 'Q';

  // Get remaining 5 squares after bishops and queen
  const afterQueen = afterBishops.filter((i) => i !== queenPos);

  // Place knights using reverse table
  const [knight1Idx, knight2Idx] = KNIGHT_TABLE_REVERSE[N];
  position[afterQueen[knight1Idx]] = 'N';
  position[afterQueen[knight2Idx]] = 'N';

  // Get remaining 3 squares for rook-king-rook
  const remaining = afterQueen.filter((_, idx) => idx !== knight1Idx && idx !== knight2Idx);

  // Place rook, king, rook (king always between rooks)
  position[remaining[0]] = 'R';
  position[remaining[1]] = 'K';
  position[remaining[2]] = 'R';

  return position as Position;
}
