import type {
  SessionReminderRequestPayload,
  SessionReminderResponse,
} from '../types/session-reminder';
import { ApiError, httpClient } from '@/shared/api/http-client';

const requestSendSessionReminder = async (
  payload: SessionReminderRequestPayload,
): Promise<SessionReminderResponse> => {
  const normalizedSessionId = payload.sessionId?.trim();
  const sessionId = Number(normalizedSessionId);
  if (!Number.isFinite(sessionId) || sessionId <= 0) {
    return {
      success: false,
      message: '유효한 세션 ID가 아닙니다.',
    };
  }

  try {
    await httpClient.post(`/api/v1/sessions/${sessionId}/reminder`, {
      sessionId,
      channel: payload.channel,
      customMessage: payload.customMessage,
    });
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

export const sendSessionReminder = (payload: SessionReminderRequestPayload) =>
  requestSendSessionReminder(payload);
export const sendSessionReminderMock = sendSessionReminder;
