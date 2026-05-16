import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { getSecureToken, setSecureToken, clearSecureTokens } from '../utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getSecureToken('ACCESS_TOKEN');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await getSecureToken('REFRESH_TOKEN');
      if (refreshToken) {
        try {
          const { data } = await axios.post<{ accessToken: string }>(
            `${BASE_URL}/auth/refresh`,
            { refreshToken },
          );
          await setSecureToken('ACCESS_TOKEN', data.accessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }
          return apiClient(originalRequest);
        } catch {
          await clearSecureTokens();
        }
      }
    }
    return Promise.reject(error);
  },
);
