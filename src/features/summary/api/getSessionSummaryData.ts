import { ApiError, httpClient } from '@/shared/api/http-client';
import type { SummaryApiResponse, SummaryPayload } from '@/features/summary/types/summary';

export const getSessionSummaryData = async (
  sessionId: string,
  locale: string,
): Promise<SummaryApiResponse<SummaryPayload>> => {
  try {
    const response = await httpClient.get<SummaryApiResponse<SummaryPayload>>(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/summary?locale=${encodeURIComponent(locale)}`,
      {
        skipAuth: true,
      },
    );

    return response;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || 'Failed to load session summary data.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};
