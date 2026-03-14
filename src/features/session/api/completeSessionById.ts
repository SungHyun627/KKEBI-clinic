import { ApiError, httpClient } from '@/shared/api/http-client';

interface CompleteSessionByIdRequest {
  sessionId: string;
}

interface ApiResponseVoid {
  code?: string;
  message?: string;
  data?: Record<string, never> | null;
}

interface CompleteSessionByIdResult {
  success: boolean;
  message?: string;
}

export const completeSessionById = async ({
  sessionId,
}: CompleteSessionByIdRequest): Promise<CompleteSessionByIdResult> => {
  try {
    const response = await httpClient.post<ApiResponseVoid>(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/complete`,
      {},
    );

    return {
      success: response.code === 'SUCCESS',
      message: response.message,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to complete session',
    };
  }
};
