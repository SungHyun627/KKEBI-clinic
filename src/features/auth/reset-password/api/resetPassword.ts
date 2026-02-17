import { ApiError, httpClient } from '@/shared/api/http-client';
import type {
  CounselorPasswordResetConfirmRequest,
  CounselorPasswordResetRequest,
} from '@/shared/api/type';

type ResetPasswordResult = {
  success: boolean;
  message?: string;
  errorCode?: 'NETWORK_ERROR' | 'CONFIG_ERROR' | 'UNKNOWN_ERROR' | 'INVALID_TOKEN' | 'UNAUTHORIZED';
};

export async function requestResetPassword(email: string): Promise<ResetPasswordResult> {
  const body: CounselorPasswordResetRequest = { email };
  try {
    await httpClient.post('/api/v1/counselor/auth/password-reset', body, { skipAuth: true });
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      try {
        const fallback = (await httpClient.post('/api/v1/auth/reset-password/request', body, {
          skipAuth: true,
          skipRefresh: true,
        })) as { success?: boolean; message?: string };
        if (fallback?.success) return { success: true, message: fallback.message };
      } catch {
        // fall through to the original error handling
      }
    }

    if (error instanceof ApiError) {
      if (error.status === 401) {
        return { success: false, errorCode: 'UNAUTHORIZED', message: error.message };
      }
      return { success: false, errorCode: 'UNKNOWN_ERROR', message: error.message };
    }
    return {
      success: false,
      errorCode: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : undefined,
    };
  }
}

export async function resetPassword({
  token,
  newPassword,
  confirmPassword,
}: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ResetPasswordResult> {
  const body: CounselorPasswordResetConfirmRequest = {
    token,
    newPassword,
    confirmPassword,
  };
  try {
    await httpClient.post('/api/v1/counselor/auth/password-reset/confirm', body, {
      skipAuth: true,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        return { success: false, errorCode: 'INVALID_TOKEN', message: error.message };
      }
      return { success: false, errorCode: 'UNKNOWN_ERROR', message: error.message };
    }
    return {
      success: false,
      errorCode: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : undefined,
    };
  }
}

// 하위 호환: 기존 mock 호출 지점에서 그대로 사용 가능
export const mockResetPassword = requestResetPassword;
