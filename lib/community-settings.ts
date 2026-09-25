export type AIProvider = 'openai' | 'anthropic' | 'gemini';
export type CastingMode = 'tap' | 'shake';

export interface CommunitySettings {
  provider: AIProvider;
  castingMode: CastingMode;
  interpretationEnabled: boolean;
  visionEnabled: boolean;
  synthesisEnabled: boolean;
}

export const COMMUNITY_SETTINGS_KEY = 'iching_light_community_settings_v1';

export const DEFAULT_COMMUNITY_SETTINGS: CommunitySettings = {
  provider: 'openai',
  castingMode: 'tap',
  interpretationEnabled: true,
  visionEnabled: true,
  synthesisEnabled: true,
};

export const PROVIDER_DETAILS: Record<
  AIProvider,
  {
    name: string;
    textModel: string;
    imageModel: string | null;
    keyUrl: string;
    keyLabel: string;
    note: string;
  }
> = {
  openai: {
    name: 'OpenAI',
    textModel: 'gpt-6-luna',
    imageModel: 'gpt-image-2.5-flare',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyLabel: 'OpenAI API key',
    note: 'Lowest-cost current GPT text model; fast image generation is available.',
  },
  anthropic: {
    name: 'Anthropic',
    textModel: 'claude-haiku-4-5-20251001',
    imageModel: null,
    keyUrl: 'https://platform.claude.com/settings/keys',
    keyLabel: 'Anthropic API key',
    note: 'Fast Claude text model. Anthropic does not offer image generation.',
  },
  gemini: {
    name: 'Google Gemini',
    textModel: 'gemini-3.1-flash-lite',
    imageModel: 'gemini-3.1-flash-lite-image',
    keyUrl: 'https://aistudio.google.com/api-keys',
    keyLabel: 'Gemini API key',
    note: 'Low-cost Gemini text plus its fastest current image model.',
  },
};

export function normalizeCommunitySettings(value: unknown): CommunitySettings {
  if (!value || typeof value !== 'object') return DEFAULT_COMMUNITY_SETTINGS;

  const candidate = value as Partial<CommunitySettings>;
  const provider: AIProvider =
    candidate.provider === 'anthropic' || candidate.provider === 'gemini'
      ? candidate.provider
      : 'openai';
  const castingMode: CastingMode = candidate.castingMode === 'shake' ? 'shake' : 'tap';

  return {
    provider,
    castingMode,
    interpretationEnabled:
      typeof candidate.interpretationEnabled === 'boolean'
        ? candidate.interpretationEnabled
        : DEFAULT_COMMUNITY_SETTINGS.interpretationEnabled,
    visionEnabled:
      typeof candidate.visionEnabled === 'boolean'
        ? candidate.visionEnabled
        : DEFAULT_COMMUNITY_SETTINGS.visionEnabled,
    synthesisEnabled:
      typeof candidate.synthesisEnabled === 'boolean'
        ? candidate.synthesisEnabled
        : DEFAULT_COMMUNITY_SETTINGS.synthesisEnabled,
  };
}

export function providerSupportsVision(provider: AIProvider): boolean {
  return PROVIDER_DETAILS[provider].imageModel !== null;
}

export function isTapCastingEnabled(mode: CastingMode, platform: string): boolean {
  return platform === 'web' || mode === 'tap';
}

export function isShakeCastingEnabled(mode: CastingMode, platform: string): boolean {
  return platform !== 'web' && mode === 'shake';
}
