import type {
  CompletedSessionGroup,
  ScheduledSessionGroup,
} from '@/features/sessions/types/session-list';

export const SCHEDULED_SESSIONS_MOCK: ScheduledSessionGroup[] = [
  {
    date: '2026-02-20',
    items: [
      {
        id: 'scheduled-1',
        clientId: 'client_1001',
        clientName: '김하늘',
        streakDays: 5,
        scheduledTime: '09:30',
        sessionType: '정기',
        moodScore: 3,
        stressScore: 4,
        riskType: '주의',
      },
      {
        id: 'scheduled-2',
        clientId: 'client_1007',
        clientName: '박준서',
        streakDays: 12,
        scheduledTime: '12:30',
        sessionType: '위기',
        moodScore: 2,
        stressScore: 5,
        riskType: '위험',
      },
      {
        id: 'scheduled-3',
        clientId: 'client_1015',
        clientName: '정도윤',
        streakDays: 9,
        scheduledTime: '15:00',
        sessionType: '정기',
        moodScore: 4,
        stressScore: 2,
        riskType: '안정',
      },
    ],
  },
  {
    date: '2026-02-21',
    items: [
      {
        id: 'scheduled-4',
        clientId: 'client_1020',
        clientName: '정시온',
        streakDays: 0,
        scheduledTime: '10:00',
        sessionType: '위기',
        moodScore: 2,
        stressScore: 5,
        riskType: '위험',
      },
      {
        id: 'scheduled-5',
        clientId: 'client_1021',
        clientName: '오하린',
        streakDays: 11,
        scheduledTime: '14:00',
        sessionType: '정기',
        moodScore: 4,
        stressScore: 2,
        riskType: '안정',
      },
    ],
  },
];

export const COMPLETED_SESSIONS_MOCK: CompletedSessionGroup[] = [
  {
    date: '2026-02-18',
    items: [
      {
        id: 'completed-1',
        clientId: 'client_1001',
        clientName: '김하늘',
        counselingDate: '2026-02-18',
        counselingDurationMinutes: 50,
      },
      {
        id: 'completed-2',
        clientId: 'client_1013',
        clientName: '최민수',
        counselingDate: '2026-02-18',
        counselingDurationMinutes: 45,
      },
    ],
  },
  {
    date: '2026-02-19',
    items: [
      {
        id: 'completed-3',
        clientId: 'client_1007',
        clientName: '박준서',
        counselingDate: '2026-02-19',
        counselingDurationMinutes: 55,
      },
      {
        id: 'completed-4',
        clientId: 'client_1015',
        clientName: '정도윤',
        counselingDate: '2026-02-19',
        counselingDurationMinutes: 40,
      },
    ],
  },
];
