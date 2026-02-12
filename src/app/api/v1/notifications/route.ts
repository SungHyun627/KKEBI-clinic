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
    createdAt: '방금 전',
    detailPath: '/clients/client_1001',
    clientId: 'client_1001',
    name: '김하늘',
    description: 'PHQ-9 점수가 21점으로 상승했습니다.',
  },
  {
    id: 'n-schedule-1',
    type: 'schedule_change',
    createdAt: '5분 전',
    detailPath: '/clients/client_1004',
    title: '일정 변경 요청',
    description: '최민수 님이 2월 14일 상담 일정 변경을 요청했습니다.',
  },
  {
    id: 'n-risk-2',
    type: 'risk',
    createdAt: '20분 전',
    detailPath: '/clients/client_1007',
    clientId: 'client_1007',
    name: '박준서',
    description: '7일 이상 앱 미사용이 감지되었습니다.',
  },
  {
    id: 'n-risk-3',
    type: 'risk',
    createdAt: '35분 전',
    detailPath: '/clients/client_1012',
    clientId: 'client_1012',
    name: '이유진',
    description: '자해 키워드가 감지되었습니다.',
  },
  {
    id: 'n-risk-4',
    type: 'risk',
    createdAt: '1시간 전',
    detailPath: '/clients/client_1016',
    clientId: 'client_1016',
    name: '한지우',
    description: 'PHQ-9 점수가 22점으로 상승했습니다.',
  },
  {
    id: 'n-risk-5',
    type: 'risk',
    createdAt: '2시간 전',
    detailPath: '/clients/client_1020',
    clientId: 'client_1020',
    name: '정시온',
    description: '7일 이상 앱 미사용이 감지되었습니다.',
  },
  {
    id: 'n-risk-6',
    type: 'risk',
    createdAt: '3시간 전',
    detailPath: '/clients/client_1024',
    clientId: 'client_1024',
    name: '최도현',
    description: '자살 키워드가 감지되었습니다.',
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
