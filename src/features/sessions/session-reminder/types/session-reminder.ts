export type ReminderChannel = 'push' | 'email' | 'sms';

export interface SessionReminderResponse {
  success: boolean;
  message?: string;
}
