import { describe, expect, it } from 'vitest';

import {
  DEFAULT_COMMUNITY_SETTINGS,
  isShakeCastingEnabled,
  isTapCastingEnabled,
  normalizeCommunitySettings,
  providerSupportsVision,
} from './community-settings';

describe('Community settings', () => {
  it('defaults to tap casting with optional AI features enabled', () => {
    expect(normalizeCommunitySettings(null)).toEqual(DEFAULT_COMMUNITY_SETTINGS);
    expect(DEFAULT_COMMUNITY_SETTINGS.castingMode).toBe('tap');
  });

  it('sanitizes unknown persisted values without enabling shake unexpectedly', () => {
    expect(normalizeCommunitySettings({ provider: 'unknown', castingMode: 'both' })).toMatchObject({
      provider: 'openai',
      castingMode: 'tap',
    });
  });

  it('makes tap and shake mutually exclusive on native platforms', () => {
    expect(isTapCastingEnabled('tap', 'android')).toBe(true);
    expect(isShakeCastingEnabled('tap', 'android')).toBe(false);
    expect(isTapCastingEnabled('shake', 'android')).toBe(false);
    expect(isShakeCastingEnabled('shake', 'android')).toBe(true);
  });

  it('keeps web casting tappable because accelerometer casting is unavailable', () => {
    expect(isTapCastingEnabled('shake', 'web')).toBe(true);
    expect(isShakeCastingEnabled('shake', 'web')).toBe(false);
  });

  it('reports image support accurately for each provider', () => {
    expect(providerSupportsVision('openai')).toBe(true);
    expect(providerSupportsVision('gemini')).toBe(true);
    expect(providerSupportsVision('anthropic')).toBe(false);
  });
});
