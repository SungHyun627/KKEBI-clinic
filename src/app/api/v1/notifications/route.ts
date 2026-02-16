import { NextResponse } from 'next/server';
import type {
  NotificationMockSet,
  NotificationItem,
  NotificationViewMode,
} from '@/features/notification/types/notification';

const MOCK_ALL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-risk-1',
    type: 'risk',
    createdAtKey: 'timeJustNow',
    clientId: 'client_1001',
    name: '김하늘',
    descriptionKey: 'riskPhq21',
  },
  {
    id: 'n-schedule-1',
    type: 'schedule_change',
    createdAtKey: 'timeMinutesAgo',
    createdAtParams: { count: 5 },
    clientId: 'client_1004',
    titleKey: 'typeScheduleChange',
    descriptionKey: 'scheduleChangeRequest',
    descriptionParams: { date: '2월 14일' },
  },
  {
    id: 'n-risk-2',
    type: 'risk',
    createdAtKey: 'timeMinutesAgo',
    createdAtParams: { count: 20 },
    clientId: 'client_1007',
    name: '박준서',
    descriptionKey: 'riskNoAppActivity7Days',
  },
  {
    id: 'n-risk-3',
    type: 'risk',
    createdAtKey: 'timeMinutesAgo',
    createdAtParams: { count: 35 },
    clientId: 'client_1012',
    name: '이유진',
    descriptionKey: 'riskSelfHarmKeywordDetected',
  },
  {
    id: 'n-risk-4',
    type: 'risk',
    createdAtKey: 'timeHoursAgo',
    createdAtParams: { count: 1 },
    clientId: 'client_1016',
    name: '한지우',
    descriptionKey: 'riskPhq22',
  },
  {
    id: 'n-risk-5',
    type: 'risk',
    createdAtKey: 'timeHoursAgo',
    createdAtParams: { count: 2 },
    clientId: 'client_1020',
    name: '정시온',
    descriptionKey: 'riskNoAppActivity7Days',
  },
  {
    id: 'n-risk-6',
    type: 'risk',
    createdAtKey: 'timeHoursAgo',
    createdAtParams: { count: 3 },
    clientId: 'client_1024',
    name: '최도현',
    descriptionKey: 'riskSuicideKeywordDetected',
  },
];

const MOCK_RISK_NOTIFICATIONS: NotificationItem[] = MOCK_ALL_NOTIFICATIONS.filter(
  (notification) => notification.type === 'risk',
).slice(0, 5);

const MOCK_EMPTY_NOTIFICATIONS: NotificationItem[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const viewMode = (searchParams.get('viewMode') as NotificationViewMode | null) ?? 'all';
  const mockSet = (searchParams.get('mockSet') as NotificationMockSet | null) ?? 'all';

  const normalizedViewMode: NotificationViewMode = viewMode === 'risk' ? 'risk' : 'all';
  const normalizedMockSet: NotificationMockSet =
    mockSet === 'risk' || mockSet === 'empty' ? mockSet : 'all';

  const itemsByMockSet: Record<NotificationMockSet, NotificationItem[]> = {
    all: MOCK_ALL_NOTIFICATIONS,
    risk: MOCK_RISK_NOTIFICATIONS,
    empty: MOCK_EMPTY_NOTIFICATIONS,
  };

  const items = itemsByMockSet[normalizedMockSet];

  const responseViewMode: NotificationViewMode =
    normalizedMockSet === 'risk' ? 'risk' : normalizedViewMode;

  return NextResponse.json({
    success: true,
    data: {
      viewMode: responseViewMode,
      items,
    },
  });
}
