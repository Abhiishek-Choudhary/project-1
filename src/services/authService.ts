import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { UserRole } from '../constants/enums';
import { MOCK_USER, delay } from '../api/mockData';
import type { AuthResponse } from '../types';
import { setSecureToken } from '../utils/storage';

const USE_MOCK = true;

export const authService = {
  async login(phone: string): Promise<{ otpSent: boolean }> {
    if (USE_MOCK) {
      await delay();
      return { otpSent: true };
    }
    const { data } = await apiClient.post(API_ENDPOINTS.auth.login, { phone });
    return data;
  },

  async signup(payload: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
  }): Promise<{ otpSent: boolean }> {
    if (USE_MOCK) {
      await delay();
      return { otpSent: true };
    }
    const { data } = await apiClient.post(API_ENDPOINTS.auth.signup, payload);
    return data;
  },

  async verifyOtp(phone: string, otp: string, role?: UserRole): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay();
      const tokens = {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
      };
      await setSecureToken('ACCESS_TOKEN', tokens.accessToken);
      await setSecureToken('REFRESH_TOKEN', tokens.refreshToken);
      return { user: { ...MOCK_USER, phone, role: role ?? MOCK_USER.role }, tokens };
    }
    const { data } = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.verifyOtp, {
      phone,
      otp,
    });
    await setSecureToken('ACCESS_TOKEN', data.tokens.accessToken);
    await setSecureToken('REFRESH_TOKEN', data.tokens.refreshToken);
    return data;
  },

  async getMe() {
    if (USE_MOCK) {
      await delay(200);
      return MOCK_USER;
    }
    const { data } = await apiClient.get(API_ENDPOINTS.auth.me);
    return data;
  },

  async logout() {
    if (!USE_MOCK) {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    }
  },
};
