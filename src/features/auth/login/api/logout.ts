import { ApiError, httpClient } from '@/shared/api/http-client';
import { clearAccessToken } from '@/shared/api/token-store';

interface LogoutResponse {
  success: boolean;
  message?: string;
  errorCode?: 'NETWORK_ERROR' | 'CONFIG_ERROR' | 'UNKNOWN_ERROR';
}

const requestLogout = async (): Promise<LogoutResponse> => {
  try {
    await httpClient.post('/api/v1/counselor/auth/logout', undefined, { skipAuth: true });
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errorCode: 'UNKNOWN_ERROR',
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : undefined,
      errorCode: 'NETWORK_ERROR',
    };
  } finally {
    clearAccessToken();
  }
};

export const logout = requestLogout;
