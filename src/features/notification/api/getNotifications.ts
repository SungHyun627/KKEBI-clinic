import { ApiError, ensureAccessToken, httpClient } from '@/shared/api/http-client';
import type {
  NotificationItem,
  NotificationListResponse,
  NotificationUnreadCountResponse,
} from '../types/notification';

interface ApiEnvelope<TData> {
  success?: boolean;
  code?: string;
  message?: string;
  data?: TData;
}

const parseNotificationItem = (row: unknown): NotificationItem | null => {
  if (typeof row !== 'object' || row === null) {
    return null;
  }

  const value = row as Record<string, unknown>;
  const id =
    typeof value.id === 'number' || typeof value.id === 'string' ? String(value.id) : undefined;
  const type = value.type;

  if (
    !id ||
    (type !== 'INTAKE_ANALYSIS_COMPLETE' &&
      type !== 'INTAKE_ANALYSIS_READY_FOR_REVIEW' &&
      type !== 'HIGH_PHQ9' &&
      type !== 'APP_INACTIVE' &&
      type !== 'SCHEDULE_CHANGE_REQUEST')
  ) {
    return null;
  }

  const referenceIdValue = value.referenceId;
  const referenceId =
    typeof referenceIdValue === 'number' || typeof referenceIdValue === 'string'
      ? String(referenceIdValue)
      : null;

  return {
    id,
    type,
    title: typeof value.title === 'string' ? value.title : '',
    message: typeof value.message === 'string' ? value.message : '',
    referenceId,
    isRead: Boolean(value.isRead),
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : '',
  };
};

const parseNotificationItems = (payload: unknown): NotificationItem[] | null => {
  if (Array.isArray(payload)) {
    return payload
      .map(parseNotificationItem)
      .filter((item): item is NotificationItem => item !== null);
  }

  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const data = (payload as Record<string, unknown>).data;
  if (Array.isArray(data)) {
    return data
      .map(parseNotificationItem)
      .filter((item): item is NotificationItem => item !== null);
  }

  return null;
};

const normalizeListResponse = (
  payload: unknown,
  fallbackMessage: string,
): NotificationListResponse => {
  const items = parseNotificationItems(payload);
  if (!items) {
    return { success: false, message: fallbackMessage };
  }

  const message =
    typeof payload === 'object' && payload !== null && 'message' in payload
      ? (payload as { message?: unknown }).message
      : undefined;

  return {
    success: true,
    data: items,
    message: typeof message === 'string' ? message : undefined,
  };
};

const parseUnreadCount = (payload: unknown): number | null => {
  if (typeof payload === 'number' && Number.isFinite(payload)) {
    return payload;
  }

  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const data = (payload as Record<string, unknown>).data;
  if (typeof data === 'number' && Number.isFinite(data)) {
    return data;
  }

  return null;
};

const normalizeUnreadCountResponse = (
  payload: unknown,
  fallbackMessage: string,
): NotificationUnreadCountResponse => {
  const count = parseUnreadCount(payload);
  if (count === null) {
    return { success: false, message: fallbackMessage };
  }

  return {
    success: true,
    data: count,
  };
};

const getUnauthorizedResponse = <
  T extends NotificationListResponse | NotificationUnreadCountResponse,
>(
  fallback: T,
): T => fallback;

export const mapNotificationPayload = (payload: unknown): NotificationItem | null => {
  const parsed = parseNotificationItem(payload);
  if (parsed) return parsed;

  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return parseNotificationItem((payload as { data?: unknown }).data);
  }

  return null;
};

export const getNotifications = async (): Promise<NotificationListResponse> => {
  try {
    const hasAccessToken = await ensureAccessToken();
    if (!hasAccessToken) {
      return getUnauthorizedResponse({ success: false, message: 'Unauthorized' });
    }

    const response = await httpClient.get<unknown>('/api/v1/notifications');
    return normalizeListResponse(response, '알림 목록을 불러오지 못했습니다.');
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '알림 목록을 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const getUnreadNotifications = async (): Promise<NotificationListResponse> => {
  try {
    const hasAccessToken = await ensureAccessToken();
    if (!hasAccessToken) {
      return getUnauthorizedResponse({ success: false, message: 'Unauthorized' });
    }

    const response = await httpClient.get<unknown>('/api/v1/notifications/unread');
    return normalizeListResponse(response, '미확인 알림 목록을 불러오지 못했습니다.');
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '미확인 알림 목록을 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const getUnreadNotificationCount = async (): Promise<NotificationUnreadCountResponse> => {
  try {
    const hasAccessToken = await ensureAccessToken();
    if (!hasAccessToken) {
      return getUnauthorizedResponse({ success: false, message: 'Unauthorized' });
    }

    const response = await httpClient.get<unknown>('/api/v1/notifications/unread/count');
    return normalizeUnreadCountResponse(response, '미확인 알림 수를 불러오지 못했습니다.');
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '미확인 알림 수를 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<{ success: boolean }> => {
  try {
    const hasAccessToken = await ensureAccessToken();
    if (!hasAccessToken) {
      return { success: false };
    }

    const response = await httpClient.put<ApiEnvelope<unknown>>(
      `/api/v1/notifications/${encodeURIComponent(notificationId)}/read`,
    );

    if (typeof response === 'object' && response !== null && 'code' in response) {
      const code = (response as { code?: unknown }).code;
      return { success: typeof code === 'string' ? code === 'SUCCESS' : true };
    }

    return { success: true };
  } catch {
    return { success: false };
  }
};
