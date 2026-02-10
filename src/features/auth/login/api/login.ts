import type { LoginFormValues } from '../types/loginForm';

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    userId?: string;
    needOtp?: boolean;
  };
}

export const login = async ({ email, password }: LoginFormValues): Promise<LoginResponse> => {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { success: false, message: 'Network error' };
  }

  const data = await res.json();
  return data;
};
