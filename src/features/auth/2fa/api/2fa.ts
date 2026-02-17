import { ApiError, httpClient } from '@/shared/api/http-client';
import { getAuthSession } from '@/features/auth/login/lib/authSession';
import { setAccessToken } from '@/shared/api/token-store';
import type {
  CounselorAuthResendOtpRequest,
  CounselorAuthVerifyOtpRequest,
} from '@/shared/api/type';

interface Resend2FAResult {
  ok: boolean;
  errorCode?: 'NETWORK_ERROR' | 'CONFIG_ERROR' | 'UNKNOWN_ERROR';
  error?: string;
}

interface Verify2FAParams {
  code: string;
}

interface Verify2FAResult {
  ok: boolean;
  data?: unknown;
  error?: string;
}

interface ApiEnvelope<TData = unknown> {
  code?: string;
  message?: string;
  data?: TData;
}

const getChallengeId = () => getAuthSession()?.challengeId;

const mapApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return {
      errorCode: (error.status === 400 ? 'UNKNOWN_ERROR' : 'NETWORK_ERROR') as
        | 'NETWORK_ERROR'
        | 'UNKNOWN_ERROR',
      error: error.message,
    };
  }
  return {
    errorCode: 'NETWORK_ERROR' as const,
    error: error instanceof Error ? error.message : 'Unknown error',
  };
};

const postVerify2FA = async ({ code }: Verify2FAParams): Promise<Verify2FAResult> => {
  const challengeId = getChallengeId();
  if (!challengeId) {
    return { ok: false, error: 'Missing challengeId. Please login again.' };
  }

  const body: CounselorAuthVerifyOtpRequest = {
    challengeId,
    otpCode: code,
  };

  try {
    const result = await httpClient.post<ApiEnvelope<Record<string, unknown>>>(
      '/api/v1/counselor/auth/2fa/verify',
      body,
      { skipAuth: true },
    );
    const token = result?.data?.accessToken;
    if (typeof token === 'string' && token) {
      setAccessToken(token);
    }
    return { ok: true, data: result };
  } catch (error) {
    const mapped = mapApiError(error);
    return { ok: false, error: mapped.error };
  }
};

const postResend2FA = async (): Promise<Resend2FAResult> => {
  const challengeId = getChallengeId();
  if (!challengeId) {
    return { ok: false, errorCode: 'CONFIG_ERROR', error: 'Missing challengeId' };
  }

  const body: CounselorAuthResendOtpRequest = {
    challengeId,
  };
  try {
    await httpClient.post('/api/v1/counselor/auth/2fa/resend', body, { skipAuth: true });
    return { ok: true };
  } catch (error) {
    const mapped = mapApiError(error);
    return { ok: false, ...mapped };
  }
};

export const resend2FA = postResend2FA;
export const verify2FA = postVerify2FA;
