import type { LoginForm } from '../types/login';

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    userId?: string;
    needOtp?: boolean;
  };
}

export const login = async ({ email, password }: LoginForm): Promise<LoginResponse> => {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { success: false, message: 'Network error' };
  }

  const data = await res.json();
  // mock API는 ok, 실제 API는 success를 반환할 수 있으므로 변환 처리
  if ('ok' in data) {
    return {
      success: data.ok,
      message: data.message,
      data: data.data,
    };
  }
  return data;
};
