interface LogoutResponse {
  success: boolean;
  message?: string;
  errorCode?: 'NETWORK_ERROR' | 'CONFIG_ERROR' | 'UNKNOWN_ERROR';
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
      errorCode: res.ok ? undefined : 'UNKNOWN_ERROR',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : undefined,
      errorCode: 'NETWORK_ERROR',
    };
  }
};

export const logoutDemo = () => requestLogout('/api/v1/auth/logout');

export const logoutServer = () => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      errorCode: 'CONFIG_ERROR',
    });
  }
  return requestLogout(`${SERVER_API_BASE_URL}/api/v1/auth/logout`);
};

// 현재 화면은 데모 API를 기본으로 사용합니다.
export const logout = logoutDemo;
