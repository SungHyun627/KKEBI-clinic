import { ApiError, httpClient } from '@/shared/api/http-client';

interface StartSessionRequest {
  clientId: string;
  scheduleId?: string;
  source?: 'dashboard' | 'sessions' | 'client-detail';
}

interface StartSessionResponseEnvelope {
  success: boolean;
  data?: {
    sessionId?: string;
  };
  message?: string;
}

interface StartSessionResult {
  success: boolean;
  sessionId?: string;
  message?: string;
}

export const startSession = async (payload: StartSessionRequest): Promise<StartSessionResult> => {
  try {
    const response = await httpClient.post<StartSessionResponseEnvelope>(
      '/api/v1/sessions/start',
      payload,
      { skipAuth: true },
    );

    return {
      success: Boolean(response?.success && response?.data?.sessionId),
      sessionId: response?.data?.sessionId,
      message: response?.message,
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

export const startSessionServer = async (
  payload: StartSessionRequest,
): Promise<StartSessionResult> => {
  try {
    const response = await httpClient.post<StartSessionResponseEnvelope>(
      '/api/v1/sessions/start',
      payload,
    );
    return {
      success: Boolean(response?.success && response?.data?.sessionId),
      sessionId: response?.data?.sessionId,
      message: response?.message,
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

export const startSessionMock = startSession;
