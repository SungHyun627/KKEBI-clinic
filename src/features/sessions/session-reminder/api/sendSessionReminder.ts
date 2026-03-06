import type { SessionReminderResponse } from '../types/session-reminder';
import { ApiError, httpClient } from '@/shared/api/http-client';

const requestSendSessionReminder = async (
  sessionIdValue: string,
): Promise<SessionReminderResponse> => {
  /** 임시로 sessionId 1 지정 */
  const normalizedSessionId = sessionIdValue?.trim() ? sessionIdValue : '1';
  const sessionId = Number(normalizedSessionId);
  if (!Number.isFinite(sessionId) || sessionId <= 0) {
    return {
      success: false,
      message: '유효한 세션 ID가 아닙니다.',
    };
  }

  try {
    await httpClient.post(`/api/v1/sessions/${sessionId}/reminder`, undefined);
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message || '세션 알림 발송에 실패했습니다.',
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const sendSessionReminder = (sessionId: string) => requestSendSessionReminder(sessionId);
export const sendSessionReminderMock = sendSessionReminder;
