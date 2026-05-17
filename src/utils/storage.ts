import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  THEME: '@freshdash/theme',
  CART: '@freshdash/cart',
  LANGUAGE: '@freshdash/language',
} as const;

const SECURE_KEYS = {
  ACCESS_TOKEN: 'freshdash_access_token',
  REFRESH_TOKEN: 'freshdash_refresh_token',
} as const;

const isWeb = Platform.OS === 'web';

async function getSecureItem(storageKey: string): Promise<string | null> {
  if (isWeb) {
    return AsyncStorage.getItem(`@secure:${storageKey}`);
  }
  try {
    return await SecureStore.getItemAsync(storageKey);
  } catch {
    return null;
  }
}

async function setSecureItem(storageKey: string, value: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.setItem(`@secure:${storageKey}`, value);
    return;
  }
  await SecureStore.setItemAsync(storageKey, value);
}

async function deleteSecureItem(storageKey: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.removeItem(`@secure:${storageKey}`);
    return;
  }
  await SecureStore.deleteItemAsync(storageKey);
}

export async function getSecureToken(key: keyof typeof SECURE_KEYS): Promise<string | null> {
  return getSecureItem(SECURE_KEYS[key]);
}

export async function setSecureToken(
  key: keyof typeof SECURE_KEYS,
  value: string,
): Promise<void> {
  await setSecureItem(SECURE_KEYS[key], value);
}

export async function clearSecureTokens(): Promise<void> {
  await Promise.all(Object.values(SECURE_KEYS).map((k) => deleteSecureItem(k)));
}

export async function getJsonStorage<T>(key: keyof typeof KEYS): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS[key]);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function setJsonStorage<T>(key: keyof typeof KEYS, value: T): Promise<void> {
  await AsyncStorage.setItem(KEYS[key], JSON.stringify(value));
}

export { KEYS, SECURE_KEYS };
