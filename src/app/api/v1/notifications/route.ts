import { NextResponse } from 'next/server';
import type {
  NotificationItem,
  NotificationViewMode,
} from '@/features/notification/types/notification';

const MOCK_NOTIFICATIONS: NotificationItem[] = [
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const viewMode = (searchParams.get('viewMode') as NotificationViewMode | null) ?? 'all';

  const normalizedViewMode: NotificationViewMode = viewMode === 'risk_only' ? 'risk_only' : 'all';

  const items =
    normalizedViewMode === 'risk_only'
      ? MOCK_NOTIFICATIONS.filter((notification) => notification.type === 'risk').slice(0, 5)
      : MOCK_NOTIFICATIONS;

  return NextResponse.json({
    success: true,
    data: {
      viewMode: normalizedViewMode,
      items,
    },
  });
}
