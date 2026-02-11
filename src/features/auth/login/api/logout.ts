interface LogoutResponse {
  success: boolean;
  message?: string;
}

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const requestLogout = async (url: string): Promise<LogoutResponse> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as LogoutResponse;
    }

    if (typeof data === 'object' && data !== null && 'ok' in data) {
      const result = data as { ok: boolean; message?: string };
      return { success: result.ok, message: result.message };
    }

    return {
      success: res.ok,
      message: res.ok ? '로그아웃되었습니다.' : '로그아웃에 실패했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const logoutDemo = () => requestLogout('/api/v1/auth/logout');

export const logoutServer = () => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    });
  }
  return requestLogout(`${SERVER_API_BASE_URL}/api/v1/auth/logout`);
};

// 현재 화면은 데모 API를 기본으로 사용합니다.
export const logout = logoutDemo;
