import { ApiError, ensureAccessToken, httpClient } from '@/shared/api/http-client';

export interface RescheduleRequestItem {
  requestId: string;
  requestedAt: string;
  reason: string;
  createdAt: string;
}

export interface GetRescheduleRequestsResponse {
  success: boolean;
  data?: RescheduleRequestItem[];
  message?: string;
}

const mapRescheduleRequestItem = (row: unknown): RescheduleRequestItem | null => {
  if (typeof row !== 'object' || row === null) return null;

  const value = row as Record<string, unknown>;
  const requestIdValue = value.requestId;
  const requestId =
    typeof requestIdValue === 'number' || typeof requestIdValue === 'string'
      ? String(requestIdValue)
      : '';

  if (!requestId) return null;

  return {
    requestId,
    requestedAt: typeof value.requestedAt === 'string' ? value.requestedAt : '',
    reason: typeof value.reason === 'string' ? value.reason : '',
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : '',
  };
};

const normalizeResponse = (payload: unknown): GetRescheduleRequestsResponse => {
  if (typeof payload !== 'object' || payload === null) {
    return { success: false, message: '일정 변경 요청 목록을 불러오지 못했습니다.' };
  }

  const value = payload as Record<string, unknown>;
  const rows = Array.isArray(value.data) ? value.data : null;
  if (!rows) {
    return {
      success: false,
      message:
        typeof value.message === 'string'
          ? value.message
          : '일정 변경 요청 목록을 불러오지 못했습니다.',
    };
  }

  const data = rows
    .map(mapRescheduleRequestItem)
    .filter((item): item is RescheduleRequestItem => item !== null);

  return {
    success: true,
    data,
    message: typeof value.message === 'string' ? value.message : undefined,
  };
};

export const getRescheduleRequests = async (
  sessionId: string,
): Promise<GetRescheduleRequestsResponse> => {
  try {
    const hasAccessToken = await ensureAccessToken();
    if (!hasAccessToken) {
      return { success: false, message: 'Unauthorized' };
    }

    const response = await httpClient.get<unknown>(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/reschedule-requests`,
    );

    return normalizeResponse(response);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '일정 변경 요청 목록을 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};
