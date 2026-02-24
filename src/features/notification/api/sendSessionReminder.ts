import type { SessionReminderPayload, SessionReminderResponse } from '../types/notification';

const requestSendSessionReminder = async (
  url: string,
  payload: SessionReminderPayload,
): Promise<SessionReminderResponse> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as SessionReminderResponse;
    }

    return {
      success: response.ok,
      message: response.ok ? undefined : '세션 알림 발송에 실패했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const sendSessionReminderMock = (payload: SessionReminderPayload) =>
  requestSendSessionReminder('/api/v1/notifications/session-reminder', payload);

export const sendSessionReminder = sendSessionReminderMock;
