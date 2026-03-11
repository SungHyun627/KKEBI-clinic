export type ReminderChannel = 'push' | 'email' | 'sms';
export type ReminderApiChannel = 'PUSH' | 'EMAIL' | 'SMS';

export interface SessionReminderRequestPayload {
  sessionId: string;
  channel: ReminderApiChannel;
  customMessage?: string;
}

export interface SessionReminderResponse {
  success: boolean;
  message?: string;
}
