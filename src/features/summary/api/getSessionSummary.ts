import { ApiError, httpClient } from '@/shared/api/http-client';
import type { SummaryApiResponse, SummaryPayload } from '@/entities/summary/model/types';

export const getSessionSummary = async (
  sessionId: number,
): Promise<SummaryApiResponse<SummaryPayload>> => {
  try {
    const response = await httpClient.get<SummaryApiResponse<SummaryPayload>>(
      `/api/v1/sessions/${encodeURIComponent(String(sessionId))}/summary`,
    );

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('[getSessionSummary][api-error]', {
        sessionId,
        status: error.status,
        code: error.code,
        errorCode: error.errorCode,
        message: error.message,
      });
    } else {
      console.error('[getSessionSummary][unknown-error]', {
        sessionId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

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
