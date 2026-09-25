import { describe, expect, it } from 'vitest';

import {
  VISION_MAX_EDGE,
  downscaleResize,
  shouldDownscale,
} from './vision-optimize';

describe('shouldDownscale', () => {
  it('re-encodes provider-resolution square images', () => {
    expect(shouldDownscale(1024, 1024)).toBe(true);
  });

  it('leaves images at or below the cap untouched', () => {
    expect(shouldDownscale(VISION_MAX_EDGE, VISION_MAX_EDGE)).toBe(false);
    expect(shouldDownscale(512, 512)).toBe(false);
    expect(shouldDownscale(768, 400)).toBe(false);
  });

  it('treats a single oversized edge as oversized', () => {
    expect(shouldDownscale(1024, 400)).toBe(true);
    expect(shouldDownscale(400, 1024)).toBe(true);
  });

  it('ignores unusable dimensions', () => {
    expect(shouldDownscale(0, 0)).toBe(false);
    expect(shouldDownscale(Number.NaN, 1024)).toBe(false);
    expect(shouldDownscale(-1024, 1024)).toBe(false);
  });
});

describe('downscaleResize', () => {
  it('caps the longer edge for a landscape image', () => {
    expect(downscaleResize(1024, 512)).toEqual({ width: VISION_MAX_EDGE, height: null });
  });

  it('caps the longer edge for a portrait image', () => {
    expect(downscaleResize(512, 1024)).toEqual({ width: null, height: VISION_MAX_EDGE });
  });

  it('caps either edge for a square image', () => {
    expect(downscaleResize(1024, 1024)).toEqual({ width: VISION_MAX_EDGE, height: null });
  });

  it('honours a custom cap', () => {
    expect(downscaleResize(2048, 2048, 512)).toEqual({ width: 512, height: null });
  });
});
