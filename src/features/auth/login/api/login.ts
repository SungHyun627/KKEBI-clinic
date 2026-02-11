import type { LoginForm } from '../types/login';

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    userId?: string;
    needOtp?: boolean;
  };
}

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const toLoginResponse = (response: Response, data: unknown): LoginResponse => {
  if (typeof data === 'object' && data !== null && 'ok' in data) {
    const result = data as { ok: boolean; message?: string; data?: LoginResponse['data'] };
    return {
      success: result.ok,
      message: result.message,
      data: result.data,
    };
  }

  if (typeof data === 'object' && data !== null && 'success' in data) {
    return data as LoginResponse;
  }

  if (!response.ok) {
    return { success: false, message: 'Network error' };
  }

  return { success: true };
};

const requestLogin = async (url: string, payload: LoginForm): Promise<LoginResponse> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    return toLoginResponse(res, data);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const loginDemo = (payload: LoginForm) => requestLogin('/api/v1/auth/login', payload);

export const loginServer = (payload: LoginForm) => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    });
  }
  return requestLogin(`${SERVER_API_BASE_URL}/api/v1/auth/login`, payload);
};

// 현재 화면은 데모 API를 기본으로 사용합니다.
export const login = loginDemo;
