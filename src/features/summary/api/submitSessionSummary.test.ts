import { beforeEach, describe, expect, it, vi } from 'vitest';
import { submitSessionSummary } from './submitSessionSummary';
import { ApiError, httpClient } from '@/shared/api/http-client';

vi.mock('@/shared/api/http-client', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    code?: string;
    errorCode?: string;
    details?: unknown;

    constructor(payload: {
      status: number;
      code?: string;
      errorCode?: string;
      message?: string;
      details?: unknown;
    }) {
      super(payload.message || 'Request failed');
      this.name = 'ApiError';
      this.status = payload.status;
      this.code = payload.code;
      this.errorCode = payload.errorCode;
      this.details = payload.details;
    }
  },
  httpClient: {
    post: vi.fn(),
  },
}));

describe('submitSessionSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('요약 제출 payload를 API DTO로 변환해서 전송한다', async () => {
    vi.mocked(httpClient.post).mockResolvedValue({
      code: 'SUCCESS',
      message: 'ok',
    });

    const result = await submitSessionSummary(12, {
      endedAt: '2026-03-18T10:00:00.000Z',
      summaryText: '요약 본문',
      riskEvaluation: 'caution',
      followUpSessionTiming: '2w',
      additionalMemo: '  메모  ',
      selectedMissionIds: ['breathing', '99', 'unknown-id'],
      nextSession: {
        date: '2026-03-25',
        startTime: '09:00',
        endTime: '09:50',
      },
    });

    expect(httpClient.post).toHaveBeenCalledWith('/api/v1/sessions/12/summary/submit', {
      sessionId: 12,
      endedAt: '2026-03-18T10:00:00.000Z',
      summaryText: '요약 본문',
      riskEvaluation: '주의',
      followUpSessionTiming: '2주 뒤',
      additionalMemo: '메모',
      selectedMissionIds: [1, 99],
      nextSession: {
        date: '2026-03-25',
        startTime: '09:00',
        endTime: '09:50',
      },
    });
    expect(result).toEqual({
      success: true,
      message: 'ok',
    });
  });

  it('SUCCESS가 아니면 실패로 처리한다', async () => {
    vi.mocked(httpClient.post).mockResolvedValue({
      code: 'BAD_REQUEST',
      message: 'invalid',
    });

    const result = await submitSessionSummary(1, {
      endedAt: '2026-03-18T10:00:00.000Z',
      summaryText: '요약',
      riskEvaluation: 'stable',
      followUpSessionTiming: '1w',
      additionalMemo: '',
      selectedMissionIds: [],
      nextSession: null,
    });

    expect(result).toEqual({
      success: false,
      message: 'invalid',
    });
  });

  it('ApiError가 발생하면 실패 응답을 반환한다', async () => {
    vi.mocked(httpClient.post).mockRejectedValue(
      new ApiError({
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: '서버 오류',
      }),
    );

    const result = await submitSessionSummary(2, {
      endedAt: '2026-03-18T10:00:00.000Z',
      summaryText: '요약',
      riskEvaluation: 'risk',
      followUpSessionTiming: 'as-needed',
      additionalMemo: '',
      selectedMissionIds: [],
      nextSession: null,
    });

    expect(result).toEqual({
      success: false,
      message: '서버 오류',
    });
  });
});
