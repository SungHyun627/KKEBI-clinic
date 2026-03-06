export type NotificationType = 'risk' | 'schedule_change';
export type NotificationViewMode = 'risk' | 'all';
export type NotificationMockSet = 'all' | 'risk' | 'empty';
type NotificationParams = Record<string, string | number>;

interface NotificationBase {
  id: string;
  type: NotificationType;
  createdAt?: string;
  createdAtKey?: string;
  createdAtParams?: NotificationParams;
  clientId: string;
}

export interface RiskNotification extends NotificationBase {
  type: 'risk';
  clientId: string;
  name: string;
  description?: string;
  descriptionKey?: string;
  descriptionParams?: NotificationParams;
}

export interface ScheduleChangeNotification extends NotificationBase {
  type: 'schedule_change';
  title?: string;
  titleKey?: string;
  titleParams?: NotificationParams;
  description?: string;
  descriptionKey?: string;
  descriptionParams?: NotificationParams;
}

export type NotificationItem = RiskNotification | ScheduleChangeNotification;

export interface NotificationListData {
  viewMode: NotificationViewMode;
  items: NotificationItem[];
}

export interface NotificationListResponse {
  success: boolean;
  data?: NotificationListData;
  message?: string;
}
