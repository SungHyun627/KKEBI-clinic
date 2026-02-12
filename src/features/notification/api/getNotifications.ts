import type {
  NotificationListResponse,
  NotificationMockSet,
  NotificationViewMode,
} from '../types/notification';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const DEMO_NOTIFICATION_MOCK_SET: NotificationMockSet = 'all';

const requestNotifications = async (url: string): Promise<NotificationListResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as NotificationListResponse;
    }

    return {
      success: response.ok,
      message: response.ok ? undefined : '알림 목록을 불러오지 못했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

const buildNotificationsUrl = (
  baseUrl: string,
  viewMode: NotificationViewMode,
  mockSet?: NotificationMockSet,
) => {
  const query = new URLSearchParams({ viewMode });
  if (mockSet) query.set('mockSet', mockSet);
  return `${baseUrl}?${query.toString()}`;
};

export const getNotificationsDemo = (
  viewMode: NotificationViewMode = 'all',
  mockSet: NotificationMockSet = 'all',
) => requestNotifications(buildNotificationsUrl('/api/v1/notifications', viewMode, mockSet));

export const getAllNotificationsDemo = () => getNotificationsDemo('all', 'all');

export const getRiskNotificationsDemo = () => getNotificationsDemo('risk', 'risk');

export const getEmptyNotificationsDemo = (viewMode: NotificationViewMode = 'all') =>
  getNotificationsDemo(viewMode, 'empty');

export const getNotificationsServer = (
  viewMode: NotificationViewMode = 'all',
  mockSet?: NotificationMockSet,
) => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    } satisfies NotificationListResponse);
  }

  return requestNotifications(
    buildNotificationsUrl(`${SERVER_API_BASE_URL}/api/v1/notifications`, viewMode, mockSet),
  );
};

export const getAllNotificationsServer = () => getNotificationsServer('all', 'all');

export const getRiskNotificationsServer = () => getNotificationsServer('risk', 'risk');

export const getEmptyNotificationsServer = (viewMode: NotificationViewMode = 'all') =>
  getNotificationsServer(viewMode, 'empty');

// 현재 화면은 데모 API를 기본으로 사용합니다.
// DEMO_NOTIFICATION_MOCK_SET을 'all' | 'risk' | 'empty' 중에서 바꿔 사용하세요.
export const getNotifications = () => getNotificationsDemo('risk');
