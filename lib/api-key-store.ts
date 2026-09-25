import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import type { AIProvider } from './community-settings';

const keyName = (provider: AIProvider) => `iching_light_community_${provider}_api_key_v1`;
const inMemoryWebKeys: Partial<Record<AIProvider, string>> = {};

export async function getApiKey(provider: AIProvider): Promise<string | null> {
  if (Platform.OS === 'web') {
    return inMemoryWebKeys[provider] ?? null;
  }

  return SecureStore.getItemAsync(keyName(provider));
}

export async function setApiKey(provider: AIProvider, apiKey: string): Promise<void> {
  const normalized = apiKey.trim();
  if (!normalized) {
    await deleteApiKey(provider);
    return;
  }

  if (Platform.OS === 'web') {
    inMemoryWebKeys[provider] = normalized;
    return;
  }

  await SecureStore.setItemAsync(keyName(provider), normalized, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function deleteApiKey(provider: AIProvider): Promise<void> {
  if (Platform.OS === 'web') {
    delete inMemoryWebKeys[provider];
    return;
  }

  await SecureStore.deleteItemAsync(keyName(provider));
}

export async function hasApiKey(provider: AIProvider): Promise<boolean> {
  const apiKey = await getApiKey(provider);
  return Boolean(apiKey?.trim());
}
