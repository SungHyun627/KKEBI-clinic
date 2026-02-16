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

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const requestJson = async (url: string, init: RequestInit) => {
  try {
    const response = await fetch(url, init);
    const data = await response.json().catch(() => ({}));
    return { response, data };
  } catch (error) {
    return {
      response: null,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const buildServerUrl = (path: string) => {
  if (!SERVER_API_BASE_URL) return null;
  return `${SERVER_API_BASE_URL}${path}`;
};

export async function resend2FADemo(): Promise<Resend2FAResult> {
  const { response, data } = await requestJson('/api/v1/auth/2fa/resend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response) {
    return { ok: false, error: data.error, errorCode: 'NETWORK_ERROR' };
  }

  return { ok: response.ok, errorCode: response.ok ? undefined : 'UNKNOWN_ERROR' };
}

export async function resend2FAServer(): Promise<Resend2FAResult> {
  const url = buildServerUrl('/api/v1/auth/2fa/resend');
  if (!url) {
    return { ok: false, errorCode: 'CONFIG_ERROR' };
  }

  const { response, data } = await requestJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response) {
    return { ok: false, error: data.error, errorCode: 'NETWORK_ERROR' };
  }

  return { ok: response.ok, errorCode: response.ok ? undefined : 'UNKNOWN_ERROR' };
}

export async function verify2FADemo({ code }: Verify2FAParams): Promise<Verify2FAResult> {
  const { response, data } = await requestJson('/api/v1/auth/2fa/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response) {
    return { ok: false, error: data.error };
  }

  return { ok: response.ok, data };
}

export async function verify2FAServer({ code }: Verify2FAParams): Promise<Verify2FAResult> {
  const url = buildServerUrl('/api/v1/auth/2fa/verify');
  if (!url) {
    return { ok: false, error: 'NEXT_PUBLIC_API_BASE_URL is not configured' };
  }

  const { response, data } = await requestJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response) {
    return { ok: false, error: data.error };
  }

  return { ok: response.ok, data };
}

// 현재 화면은 데모 API를 기본으로 사용합니다.
export const resend2FA = resend2FADemo;
export const verify2FA = verify2FADemo;
