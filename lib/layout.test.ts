import { describe, expect, it } from 'vitest';
import { isCompactOracleWindow } from './layout';

describe('oracle window breakpoints', () => {
  it('uses compact mode for the Titan 2 Elite display', () => {
    expect(isCompactOracleWindow(1080, 1200)).toBe(true);
  });

  it('keeps the standard layout on a conventional tall phone', () => {
    expect(isCompactOracleWindow(1080, 2400)).toBe(false);
  });

  it('ignores invalid measurements', () => {
    expect(isCompactOracleWindow(0, 1200)).toBe(false);
  });
});
