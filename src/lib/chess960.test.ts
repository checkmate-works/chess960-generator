import { describe, it, expect } from 'vitest';
import {
  calculatePositionId,
  positionFromId,
  positionToString,
  type Position,
} from './chess960';

describe('calculatePositionId', () => {
  it('should return 518 for standard chess position RNBQKBNR', () => {
    const position: Position = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    expect(calculatePositionId(position)).toBe(518);
  });

  it('should return 0 for position BBQNNRKR', () => {
    // ID 0: L=0 (b1), D=0 (a1), Q=0, N=0
    // Bishops on a1(0) and b1(1), Queen on c1(2), Knights on d1(3) and e1(4)
    const position: Position = ['B', 'B', 'Q', 'N', 'N', 'R', 'K', 'R'];
    expect(calculatePositionId(position)).toBe(0);
  });

  it('should return 959 for position RKRNNQBB', () => {
    // ID 959: L=3 (h1), D=3 (g1), Q=5, N=9
    const position: Position = ['R', 'K', 'R', 'N', 'N', 'Q', 'B', 'B'];
    expect(calculatePositionId(position)).toBe(959);
  });

  it('should return 534 for position RNBKQBNR', () => {
    // Similar to standard but K and Q swapped
    const position: Position = ['R', 'N', 'B', 'K', 'Q', 'B', 'N', 'R'];
    expect(calculatePositionId(position)).toBe(534);
  });

  it('should return 246 for position NRBKQBNR', () => {
    const position: Position = ['N', 'R', 'B', 'K', 'Q', 'B', 'N', 'R'];
    expect(calculatePositionId(position)).toBe(246);
  });
});

describe('positionFromId', () => {
  it('should return RNBQKBNR for ID 518', () => {
    const position = positionFromId(518);
    expect(positionToString(position)).toBe('RNBQKBNR');
  });

  it('should return BBQNNRKR for ID 0', () => {
    const position = positionFromId(0);
    expect(positionToString(position)).toBe('BBQNNRKR');
  });

  it('should return RKRNNQBB for ID 959', () => {
    const position = positionFromId(959);
    expect(positionToString(position)).toBe('RKRNNQBB');
  });

  it('should throw error for invalid ID', () => {
    expect(() => positionFromId(-1)).toThrow();
    expect(() => positionFromId(960)).toThrow();
    expect(() => positionFromId(1.5)).toThrow();
  });

  it('should be the inverse of calculatePositionId for all IDs', () => {
    // Test a sample of IDs across the range
    const testIds = [0, 1, 100, 250, 500, 518, 750, 900, 959];
    for (const id of testIds) {
      const position = positionFromId(id);
      expect(calculatePositionId(position)).toBe(id);
    }
  });
});

describe('positionToString', () => {
  it('should convert position array to string', () => {
    const position: Position = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    expect(positionToString(position)).toBe('RNBQKBNR');
  });

  it('should handle different positions', () => {
    const position: Position = ['B', 'B', 'Q', 'N', 'N', 'R', 'K', 'R'];
    expect(positionToString(position)).toBe('BBQNNRKR');
  });
});
