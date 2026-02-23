import { ApiError, httpClient } from '@/shared/api/http-client';
import type {
  SummaryApiResponse,
  SubmitSessionSummaryPayload,
  SubmitSessionSummaryResponse,
} from '@/features/summary/types/summary';

export const submitSessionSummary = async (
  sessionId: string,
  payload: SubmitSessionSummaryPayload,
): Promise<SubmitSessionSummaryResponse> => {
  try {
    const response = await httpClient.post<SummaryApiResponse>(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/summary/submit`,
      payload,
      { skipAuth: true },
    );

    return {
      success: response.success,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || 'Failed to submit session summary.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};
