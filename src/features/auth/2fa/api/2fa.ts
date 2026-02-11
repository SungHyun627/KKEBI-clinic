interface Resend2FAResult {
  ok: boolean;
  message?: string;
  error?: string;
}

export async function resend2FA(): Promise<Resend2FAResult> {
  try {
    const response = await fetch('/api/v1/auth/2fa/resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return { ok: response.ok, message: data.message };
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { ok: false, error: message };
  }
}

interface Verify2FAParams {
  code: string;
}

interface Verify2FAResult {
  ok: boolean;
  data?: unknown;
  error?: string;
}

export async function verify2FA({ code }: Verify2FAParams): Promise<Verify2FAResult> {
  try {
    const response = await fetch('/api/v1/auth/2fa/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    return { ok: false, error: message };
  }
}
