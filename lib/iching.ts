import iChingData from '@/data/iching.json';
import type { Hexagram, IChingData, Reading } from '@/data/types';

const data = iChingData as IChingData;

/**
 * Get a hexagram by its number (1-64)
 */
export function getHexagram(number: number): Hexagram | null {
  const key = String(number);
  return data[key] || null;
}

/**
 * Get all 64 hexagrams
 */
export function getAllHexagrams(): Hexagram[] {
  return Object.values(data);
}

/**
 * Cast a single line using the three-coin method
 * Returns: 6 (old yin), 7 (young yang), 8 (young yin), 9 (old yang)
 */
export function castLine(): number {
  // Simulate three coin tosses (heads=3, tails=2)
  const coins = [
    Math.random() < 0.5 ? 3 : 2,
    Math.random() < 0.5 ? 3 : 2,
    Math.random() < 0.5 ? 3 : 2,
  ];
  return coins.reduce((sum, coin) => sum + coin, 0);
}

/**
 * Cast all six lines for a complete hexagram
 * Returns array of 6 line values from bottom to top
 */
export function castHexagram(): number[] {
  return Array.from({ length: 6 }, () => castLine());
}

/**
 * Convert line values to binary representation
 * Yang (7, 9) = 1, Yin (6, 8) = 0
 */
export function linesToBinary(lines: number[]): string {
  return lines
    .map(line => (line === 7 || line === 9 ? 1 : 0))
    .reverse() // Top line first for binary
    .join('');
}

/**
 * Find hexagram number from binary representation
 */
export function binaryToHexagramNumber(binary: string): number {
  // Search through all hexagrams to find matching binary
  for (const [key, hexagram] of Object.entries(data)) {
    const hexBinary = String(hexagram.binary).padStart(6, '0');
    if (hexBinary === binary) {
      return parseInt(key);
    }
  }
  return 1; // Default to first hexagram
}

/**
 * Get hexagram number from cast lines
 */
export function getHexagramFromLines(lines: number[]): number {
  const binary = linesToBinary(lines);
  return binaryToHexagramNumber(binary);
}

/**
 * Check if a line is a changing line (old yin or old yang)
 */
export function isChangingLine(lineValue: number): boolean {
  return lineValue === 6 || lineValue === 9;
}

/**
 * Get the changing lines from a cast
 */
export function getChangingLines(lines: number[]): number[] {
  return lines
    .map((line, index) => (isChangingLine(line) ? index + 1 : -1))
    .filter(index => index !== -1);
}

/**
 * Determine if a line is yang (solid) or yin (broken)
 */
export function isYang(lineValue: number): boolean {
  return lineValue === 7 || lineValue === 9;
}

/**
 * Generate a unique ID for readings
 */
export function generateReadingId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new reading object
 */
export function createReading(lines: number[]): Reading {
  return {
    id: generateReadingId(),
    hexagramNumber: getHexagramFromLines(lines),
    date: new Date().toISOString(),
    lines,
  };
}

/**
 * Transform lines to get the resulting hexagram
 * Old yin (6) becomes yang (7)
 * Old yang (9) becomes yin (8)
 * Young lines stay the same
 */
export function transformLines(lines: number[]): number[] {
  return lines.map(line => {
    if (line === 6) return 7; // Old yin becomes young yang
    if (line === 9) return 8; // Old yang becomes young yin
    return line; // Young lines don't change
  });
}

/**
 * Get the transformed hexagram number (where the situation leads)
 * Returns null if there are no changing lines
 */
export function getTransformedHexagramNumber(lines: number[]): number | null {
  const changingLines = getChangingLines(lines);
  if (changingLines.length === 0) return null;
  
  const transformedLines = transformLines(lines);
  return getHexagramFromLines(transformedLines);
}

/**
 * Get the transformed hexagram object (where the situation leads)
 * Returns null if there are no changing lines
 */
export function getTransformedHexagram(hexagramNumber: number, lines: number[]): Hexagram | null {
  const transformedNumber = getTransformedHexagramNumber(lines);
  if (transformedNumber === null) return null;
  return getHexagram(transformedNumber);
}

/**
 * Check if a reading has any changing lines
 */
export function hasChangingLines(lines: number[]): boolean {
  return lines.some(line => line === 6 || line === 9);
}

/**
 * Format date for display
 */
export function formatReadingDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
