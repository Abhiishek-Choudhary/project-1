import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  THEME: '@freshdash/theme',
  CART: '@freshdash/cart',
} as const;

const SECURE_KEYS = {
  ACCESS_TOKEN: 'freshdash_access_token',
  REFRESH_TOKEN: 'freshdash_refresh_token',
} as const;

export async function getSecureToken(key: keyof typeof SECURE_KEYS): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SECURE_KEYS[key]);
  } catch {
    return null;
  }
}

export async function setSecureToken(
  key: keyof typeof SECURE_KEYS,
  value: string,
): Promise<void> {
  await SecureStore.setItemAsync(SECURE_KEYS[key], value);
}

export async function clearSecureTokens(): Promise<void> {
  await Promise.all(
    Object.values(SECURE_KEYS).map((k) => SecureStore.deleteItemAsync(k)),
  );
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
