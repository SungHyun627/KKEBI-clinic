export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  ok: boolean;
  message: string;
};

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = (await response.json().catch(() => ({
    ok: false,
    message: '로그인에 실패했습니다.',
  }))) as LoginResponse;

  if (!response.ok) {
    return { ok: false, message: data.message ?? '로그인에 실패했습니다.' };
  }

  return data;
}
