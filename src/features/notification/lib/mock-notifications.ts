import type { NotificationItem } from '../types/notification';

const now = Date.now();

export const buildMockNotifications = (): NotificationItem[] => {
  return [
    {
      id: 'mock-1',
      type: 'HIGH_PHQ9',
      title: '[위험 알림]',
      message: '김하늘님의 PHQ-9 점수가 22점으로 확인되었습니다.',
      referenceId: '1201',
      isRead: false,
      createdAt: new Date(now - 3 * 60 * 1000).toISOString(),
    },
    {
      id: 'mock-2',
      type: 'SCHEDULE_CHANGE_REQUEST',
      title: '[일정 변경 요청]',
      message: '홍길동님이 2026년 3월 20일 14:00 일정 변경을 요청했습니다.',
      referenceId: '987',
      isRead: false,
      createdAt: new Date(now - 12 * 60 * 1000).toISOString(),
    },
    {
      id: 'mock-3',
      type: 'INTAKE_ANALYSIS_COMPLETE',
      title: '[접수 분석 완료]',
      message: '접수면접 분석이 완료되었습니다. 결과를 확인해주세요.',
      referenceId: '5003',
      isRead: true,
      createdAt: new Date(now - 70 * 60 * 1000).toISOString(),
    },
    {
      id: 'mock-4',
      type: 'APP_INACTIVE',
      title: '[활동 알림]',
      message: '이유진님이 7일 이상 앱에 접속하지 않았습니다.',
      referenceId: '1044',
      isRead: true,
      createdAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
    },
  ];
};
