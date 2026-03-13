import { ApiError, httpClient } from '@/shared/api/http-client';

interface ApiEnvelope<TData = unknown> {
  code?: string;
  message?: string;
  data?: TData;
}

interface ScheduleSessionPayload {
  clientId: number;
  scheduledAt: string;
}

interface ScheduleSessionResult {
  success: boolean;
  sessionId?: number;
  message?: string;
}

export const scheduleSession = async (
  payload: ScheduleSessionPayload,
): Promise<ScheduleSessionResult> => {
  try {
    const response = await httpClient.post<ApiEnvelope<number>>('/api/v1/sessions', payload);
    return {
      success: true,
      sessionId: typeof response.data === 'number' ? response.data : undefined,
      message: response.message,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : '상담 예약 생성에 실패했습니다.',
    };
  }
};
