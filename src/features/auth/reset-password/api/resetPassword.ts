const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

type ResetPasswordResult = {
  success: boolean;
  message?: string;
  errorCode?: 'NETWORK_ERROR' | 'CONFIG_ERROR' | 'UNKNOWN_ERROR';
};

const postJson = async <T>(url: string, body: unknown): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
};

export async function requestResetPasswordDemo(email: string): Promise<ResetPasswordResult> {
  return postJson<ResetPasswordResult>('/api/v1/auth/reset-password/request', { email });
}

export async function resetPasswordDemo({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}): Promise<ResetPasswordResult> {
  return postJson<ResetPasswordResult>('/api/v1/auth/reset-password', { email, newPassword });
}

export async function requestResetPasswordServer(email: string): Promise<ResetPasswordResult> {
  if (!SERVER_API_BASE_URL) {
    return { success: false, errorCode: 'CONFIG_ERROR' };
  }
  return postJson<ResetPasswordResult>(
    `${SERVER_API_BASE_URL}/api/v1/auth/reset-password/request`,
    {
      email,
    },
  );
}

export async function resetPasswordServer({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}): Promise<ResetPasswordResult> {
  if (!SERVER_API_BASE_URL) {
    return { success: false, errorCode: 'CONFIG_ERROR' };
  }
  return postJson<ResetPasswordResult>(`${SERVER_API_BASE_URL}/api/v1/auth/reset-password`, {
    email,
    newPassword,
  });
}

// 현재 화면은 데모 API를 기본으로 사용합니다.
export const requestResetPassword = requestResetPasswordDemo;
export const resetPassword = resetPasswordDemo;

// 하위 호환: 기존 mock 호출 지점에서 그대로 사용 가능
export const mockResetPassword = requestResetPasswordDemo;
