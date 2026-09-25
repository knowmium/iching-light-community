export const COMPACT_SCREEN_MAX_HEIGHT_TO_WIDTH = 1.25;

export function isCompactOracleWindow(width: number, height: number): boolean {
  if (width <= 0 || height <= 0) return false;
  return height / width <= COMPACT_SCREEN_MAX_HEIGHT_TO_WIDTH;
}
