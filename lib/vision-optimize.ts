/**
 * Sizing policy for generated Vision images.
 *
 * Vision images arrive at provider resolution (1024 x 1024 today) but are shown
 * inside a card that is only a few hundred points wide. Decoding four times the
 * pixels needed is what makes the card appear slowly once the request finishes,
 * and it also leaves a multi-megabyte PNG in the reading archive.
 *
 * This module holds the pure sizing decision so it can be tested without a
 * device. The re-encode itself lives in `lib/byok-ai.ts`, next to the image
 * request that produces the file.
 */

/** Longest edge kept for a stored Vision image. */
export const VISION_MAX_EDGE = 768;

/** True when the image is larger than the stored cap and is worth re-encoding. */
export function shouldDownscale(
  width: number,
  height: number,
  maxEdge: number = VISION_MAX_EDGE,
): boolean {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return false;
  }
  return width > maxEdge || height > maxEdge;
}

/**
 * Resize target that caps the longer edge and preserves the aspect ratio.
 * `resize` treats `null` as "derive from the other dimension".
 */
export function downscaleResize(
  width: number,
  height: number,
  maxEdge: number = VISION_MAX_EDGE,
): { width: number | null; height: number | null } {
  return width >= height
    ? { width: maxEdge, height: null }
    : { width: null, height: maxEdge };
}
