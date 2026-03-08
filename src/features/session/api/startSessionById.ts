import { ApiError, httpClient } from '@/shared/api/http-client';

interface StartSessionByIdRequest {
  sessionId: string;
  source?: string;
}

interface SessionStartResponse {
  sessionId?: number;
  fastApiSessionId?: string;
}

interface ApiResponseSessionStartResponse {
  code?: string;
  message?: string;
  data?: SessionStartResponse;
}

interface StartSessionByIdResult {
  success: boolean;
  data?: SessionStartResponse;
  message?: string;
}

export const startSessionById = async ({
  sessionId,
  source = 'WEB',
}: StartSessionByIdRequest): Promise<StartSessionByIdResult> => {
  try {
    const response = await httpClient.post<ApiResponseSessionStartResponse>(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/start`,
      { source },
    );

    return {
      success: response.code === 'SUCCESS',
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to start session',
    };
  }
};
