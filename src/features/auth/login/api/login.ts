import type { LoginForm } from '../types/login';
import { ApiError, httpClient } from '@/shared/api/http-client';
import type { CounselorAuthLoginRequest } from '@/shared/api/type';

interface LoginResponse {
  success: boolean;
  message?: string;
  errorCode?: 'AUTH_FAILED' | 'NETWORK_ERROR' | 'CONFIG_ERROR' | 'UNKNOWN_ERROR';
  data?: {
    userId?: string;
    needOtp?: boolean;
    challengeId?: string;
  };
}

interface ApiEnvelope<TData = unknown> {
  code?: string;
  message?: string;
  data?: TData;
}

const requestLogin = async (payload: LoginForm): Promise<LoginResponse> => {
  try {
    const body: CounselorAuthLoginRequest = {
      email: payload.email,
      password: payload.password,
    };
    const response = await httpClient.post<ApiEnvelope<Record<string, unknown>>>(
      '/api/v1/counselor/auth/login',
      body,
      { skipAuth: true },
    );
    const data = response?.data ?? {};
    return {
      success: true,
      message: response?.message,
      data: {
        userId:
          typeof data.userId === 'string'
            ? data.userId
            : typeof data.userId === 'number'
              ? String(data.userId)
              : undefined,
        needOtp: true,
        challengeId: typeof data.challengeId === 'string' ? data.challengeId : undefined,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        return { success: false, errorCode: 'AUTH_FAILED', message: error.message };
      }
      return { success: false, errorCode: 'UNKNOWN_ERROR', message: error.message };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : undefined,
      errorCode: 'NETWORK_ERROR',
    };
  }
};

export const login = requestLogin;
