import { apiClient } from '../../../api/apiClient';
import { env } from '../../../config/env';
import type { Portal, User } from '../store/auth.types';
import { authApiMock } from './auth.api.mock';

export interface LoginRequest {
  email: string;
  password: string;
  portal: Portal;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
}

export interface MeResponse {
  user: User;
}

const realAuthApi = {
  login(payload: LoginRequest) {
    return apiClient.post<LoginResponse>('/auth/login', payload);
  },
  logout() {
    return apiClient.post<void>('/auth/logout');
  },
  me() {
    return apiClient.get<MeResponse>('/auth/me');
  },
};

export const authApi = env.USE_AUTH_MOCK ? authApiMock : realAuthApi;
