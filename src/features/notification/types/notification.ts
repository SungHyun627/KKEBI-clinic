import type { components } from '@/shared/api/generated-types';

export type NotificationApiType = NonNullable<
  components['schemas']['NotificationResponse']['type']
>;

export interface NotificationItem {
  id: string;
  type: NotificationApiType;
  title: string;
  message: string;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  success: boolean;
  data?: NotificationItem[];
  message?: string;
}

export interface NotificationUnreadCountResponse {
  success: boolean;
  data?: number;
  message?: string;
}
