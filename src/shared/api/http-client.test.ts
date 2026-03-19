import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, request } from './http-client';
import { clearAccessToken, getAccessToken, setAccessToken } from './token-store';

describe('http-client auth flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearAccessToken();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('401 응답이면 refresh 후 원요청을 재시도한다', async () => {
    setAccessToken('expired-token');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'expired' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            data: { accessToken: 'renewed-token' },
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 'SUCCESS', data: { ok: true } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const result = await request<{ code: string; data: { ok: boolean } }>('/api/v1/sessions');

    expect(result).toEqual({ code: 'SUCCESS', data: { ok: true } });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/v1/counselor/auth/refresh',
      expect.objectContaining({
        method: 'POST',
      }),
    );

    const thirdCallOptions = fetchMock.mock.calls[2]?.[1] as RequestInit;
    const authHeader = new Headers(thirdCallOptions.headers).get('Authorization');
    expect(authHeader).toBe('Bearer renewed-token');
    expect(getAccessToken()).toBe('renewed-token');
  });

  it('refresh 실패 시 토큰을 비우고 401 에러를 반환한다', async () => {
    setAccessToken('expired-token');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'expired' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(new Response('refresh failed', { status: 500 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'expired' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const promise = request('/api/v1/clients');
    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
    });
    expect(getAccessToken()).toBeNull();
  });

  it('403 응답은 refresh 없이 그대로 ApiError를 던진다', async () => {
    setAccessToken('valid-token');
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 'FORBIDDEN', message: '권한 없음' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(request('/api/v1/admin')).rejects.toMatchObject({
      status: 403,
      code: 'FORBIDDEN',
      message: '권한 없음',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
