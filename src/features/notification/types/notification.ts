export type NotificationType = 'risk' | 'schedule_change';
export type NotificationViewMode = 'risk_only' | 'all';

interface NotificationBase {
  id: string;
  type: NotificationType;
  createdAt: string;
  detailPath: string;
}

export interface RiskNotification extends NotificationBase {
  type: 'risk';
  clientId: string;
  name: string;
  description: string;
}

export interface ScheduleChangeNotification extends NotificationBase {
  type: 'schedule_change';
  title: string;
  description: string;
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
