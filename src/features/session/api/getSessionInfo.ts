import { ApiError, httpClient } from '@/shared/api/http-client';
import type { SessionInfoResponse } from '../types/session';

export const getSessionInfo = async (sessionId: string): Promise<SessionInfoResponse> => {
  try {
    const response = await httpClient.get<SessionInfoResponse>(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}`,
    );
    return response;
  } catch (error) {
    return {
      code: 'ERROR',
      message:
        error instanceof ApiError
          ? error.message || 'Failed to load session page data.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};
