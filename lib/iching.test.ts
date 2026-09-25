import { describe, it, expect } from 'vitest';
import {
  castLine,
  castHexagram,
  linesToBinary,
  isYang,
  isChangingLine,
  getChangingLines,
  generateReadingId,
  createReading,
  formatReadingDate,
  transformLines,
  getTransformedHexagram,
  hasChangingLines,
} from './iching';

describe('I Ching Utilities', () => {
  describe('castLine', () => {
    it('should return a value between 6 and 9', () => {
      for (let i = 0; i < 100; i++) {
        const line = castLine();
        expect(line).toBeGreaterThanOrEqual(6);
        expect(line).toBeLessThanOrEqual(9);
      }
    });
  });

  describe('castHexagram', () => {
    it('should return an array of 6 lines', () => {
      const hexagram = castHexagram();
      expect(hexagram).toHaveLength(6);
    });

    it('should return valid line values', () => {
      const hexagram = castHexagram();
      hexagram.forEach(line => {
        expect(line).toBeGreaterThanOrEqual(6);
        expect(line).toBeLessThanOrEqual(9);
      });
    });
  });

  describe('linesToBinary', () => {
    it('should convert yang lines (7, 9) to 1', () => {
      const lines = [7, 7, 7, 7, 7, 7];
      const binary = linesToBinary(lines);
      expect(binary).toBe('111111');
    });

    it('should convert yin lines (6, 8) to 0', () => {
      const lines = [8, 8, 8, 8, 8, 8];
      const binary = linesToBinary(lines);
      expect(binary).toBe('000000');
    });

    it('should handle mixed lines correctly', () => {
      // Lines from bottom to top: 7, 8, 7, 8, 7, 8
      // Binary from top to bottom: 0, 1, 0, 1, 0, 1
      const lines = [7, 8, 7, 8, 7, 8];
      const binary = linesToBinary(lines);
      expect(binary).toBe('010101');
    });
  });

  describe('isYang', () => {
    it('should return true for yang lines (7, 9)', () => {
      expect(isYang(7)).toBe(true);
      expect(isYang(9)).toBe(true);
    });

    it('should return false for yin lines (6, 8)', () => {
      expect(isYang(6)).toBe(false);
      expect(isYang(8)).toBe(false);
    });
  });

  describe('isChangingLine', () => {
    it('should return true for old yin (6) and old yang (9)', () => {
      expect(isChangingLine(6)).toBe(true);
      expect(isChangingLine(9)).toBe(true);
    });

    it('should return false for young yin (8) and young yang (7)', () => {
      expect(isChangingLine(7)).toBe(false);
      expect(isChangingLine(8)).toBe(false);
    });
  });

  describe('getChangingLines', () => {
    it('should return empty array when no changing lines', () => {
      const lines = [7, 8, 7, 8, 7, 8];
      const changing = getChangingLines(lines);
      expect(changing).toEqual([]);
    });

    it('should return correct line numbers for changing lines', () => {
      const lines = [9, 7, 6, 8, 9, 7]; // Lines 1, 3, 5 are changing
      const changing = getChangingLines(lines);
      expect(changing).toEqual([1, 3, 5]);
    });

    it('should return all lines when all are changing', () => {
      const lines = [9, 6, 9, 6, 9, 6];
      const changing = getChangingLines(lines);
      expect(changing).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('generateReadingId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateReadingId();
      const id2 = generateReadingId();
      expect(id1).not.toBe(id2);
    });

    it('should generate string IDs', () => {
      const id = generateReadingId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('createReading', () => {
    it('should create a reading with all required fields', () => {
      const lines = [7, 8, 7, 8, 7, 8];
      const reading = createReading(lines);
      
      expect(reading).toHaveProperty('id');
      expect(reading).toHaveProperty('hexagramNumber');
      expect(reading).toHaveProperty('date');
      expect(reading).toHaveProperty('lines');
      expect(reading.lines).toEqual(lines);
    });

    it('should generate a valid ISO date string', () => {
      const lines = [7, 7, 7, 7, 7, 7];
      const reading = createReading(lines);
      
      const date = new Date(reading.date);
      expect(date.toString()).not.toBe('Invalid Date');
    });
  });

  describe('formatReadingDate', () => {
    it('should format ISO date to readable string', () => {
      const isoDate = '2025-12-26T12:00:00.000Z';
      const formatted = formatReadingDate(isoDate);
      
      expect(formatted).toContain('Dec');
      expect(formatted).toContain('26');
      expect(formatted).toContain('2025');
    });
  });

  describe('transformLines', () => {
    it('should transform old yin (6) to young yang (7)', () => {
      const lines = [6, 7, 8, 7, 8, 7];
      const result = transformLines(lines);
      expect(result[0]).toBe(7);
    });

    it('should transform old yang (9) to young yin (8)', () => {
      const lines = [7, 9, 8, 7, 8, 7];
      const result = transformLines(lines);
      expect(result[1]).toBe(8);
    });

    it('should not change young lines', () => {
      const lines = [7, 8, 7, 8, 7, 8];
      const result = transformLines(lines);
      expect(result).toEqual([7, 8, 7, 8, 7, 8]);
    });
  });

  describe('getTransformedHexagram', () => {
    it('should return null when no changing lines', () => {
      const lines = [7, 8, 7, 8, 7, 8];
      const result = getTransformedHexagram(1, lines);
      expect(result).toBeNull();
    });

    it('should return a hexagram object when there are changing lines', () => {
      const lines = [9, 8, 7, 8, 7, 8]; // Has old yang
      const result = getTransformedHexagram(1, lines);
      expect(result).not.toBeNull();
      expect(result?.hex).toBeGreaterThanOrEqual(1);
      expect(result?.hex).toBeLessThanOrEqual(64);
    });
  });

  describe('hasChangingLines', () => {
    it('should return true when lines contain 6', () => {
      expect(hasChangingLines([7, 6, 8, 7, 8, 7])).toBe(true);
    });

    it('should return true when lines contain 9', () => {
      expect(hasChangingLines([7, 9, 8, 7, 8, 7])).toBe(true);
    });

    it('should return false when no changing lines', () => {
      expect(hasChangingLines([7, 8, 7, 8, 7, 8])).toBe(false);
    });
  });
});
