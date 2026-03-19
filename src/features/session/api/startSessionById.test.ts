import { beforeEach, describe, expect, it, vi } from 'vitest';
import { startSessionById } from './startSessionById';
import { ApiError, httpClient } from '@/shared/api/http-client';

vi.mock('@/shared/api/http-client', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    code?: string;

    constructor(payload: { status: number; code?: string; message?: string }) {
      super(payload.message || 'Request failed');
      this.name = 'ApiError';
      this.status = payload.status;
      this.code = payload.code;
    }
  },
  httpClient: {
    post: vi.fn(),
  },
}));

describe('startSessionById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('세션 시작 요청 성공 응답을 반환한다', async () => {
    vi.mocked(httpClient.post).mockResolvedValue({
      code: 'SUCCESS',
      message: 'ok',
      data: {
        sessionId: 1,
        fastApiSessionId: 'fastapi-1',
      },
    });

    const result = await startSessionById({ sessionId: '1' });

    expect(httpClient.post).toHaveBeenCalledWith('/api/v1/sessions/1/start', {
      source: 'WEB',
    });
    expect(result).toEqual({
      success: true,
      message: 'ok',
      data: {
        sessionId: 1,
        fastApiSessionId: 'fastapi-1',
      },
    });
  });

  it('ApiError가 발생하면 실패와 메시지를 반환한다', async () => {
    vi.mocked(httpClient.post).mockRejectedValue(
      new ApiError({
        status: 401,
        code: 'UNAUTHORIZED',
        message: '인증이 만료되었습니다.',
      }),
    );

    const result = await startSessionById({ sessionId: '2' });

    expect(result).toEqual({
      success: false,
      message: '인증이 만료되었습니다.',
    });
  });

  it('알 수 없는 에러는 기본 실패 메시지로 반환한다', async () => {
    vi.mocked(httpClient.post).mockRejectedValue('unknown');

    const result = await startSessionById({ sessionId: '3' });

    expect(result).toEqual({
      success: false,
      message: 'Failed to start session',
    });
  });
});
