import type { SessionStatus } from '../types/session-list';

type Locale = 'ko' | 'en';

type MockSessionItem = {
  id: number;
  date: string;
  time: string;
  names: {
    ko: string;
    en: string;
  };
  sessionNumber: number;
  sessionType: 'INITIAL' | 'REGULAR' | 'CRISIS';
  riskType: 'STABLE' | 'CAUTION' | 'RISK';
};

type SessionListMockEnvelope = {
  code: 'SUCCESS';
  message: string;
  data: {
    scheduledSessions?: Array<{
      id: number;
      scheduledAt: string;
      clientName: string;
      sessionNumber: number;
      sessionType: string;
      riskType: string;
      contact: string;
    }>;
    completedSessions?: Array<{
      id: number;
      date: string;
      clientName: string;
      sessionNumber: number;
      sessionType: string;
      riskType: string;
      summary: string;
    }>;
  };
};

const MARCH_2026_DATES = Array.from({ length: 31 }, (_, index) => {
  const day = String(index + 1).padStart(2, '0');
  return `2026-03-${day}`;
});

const getMockItemCount = (date: string) => {
  const day = Number(date.split('-')[2]);
  const pattern = [3, 4, 5];
  return pattern[(day - 1) % pattern.length];
};

const SCHEDULED_BASE: MockSessionItem[] = [
  {
    id: 14537,
    date: '2026-03-03',
    time: '10:00',
    names: { ko: '테스트37', en: 'Test 37' },
    sessionNumber: 1,
    sessionType: 'INITIAL',
    riskType: 'CAUTION',
  },
  {
    id: 14538,
    date: '2026-03-03',
    time: '10:20',
    names: { ko: '테스트38', en: 'Test 38' },
    sessionNumber: 2,
    sessionType: 'REGULAR',
    riskType: 'STABLE',
  },
  {
    id: 14539,
    date: '2026-03-03',
    time: '10:40',
    names: { ko: '테스트39', en: 'Test 39' },
    sessionNumber: 3,
    sessionType: 'REGULAR',
    riskType: 'RISK',
  },
  {
    id: 14540,
    date: '2026-03-03',
    time: '11:00',
    names: { ko: '테스트40', en: 'Test 40' },
    sessionNumber: 4,
    sessionType: 'INITIAL',
    riskType: 'CAUTION',
  },
  {
    id: 14541,
    date: '2026-03-03',
    time: '11:20',
    names: { ko: '테스트41', en: 'Test 41' },
    sessionNumber: 5,
    sessionType: 'CRISIS',
    riskType: 'RISK',
  },
];

const COMPLETED_BASE: MockSessionItem[] = [
  {
    id: 15537,
    date: '2026-03-03',
    time: '09:20',
    names: { ko: '완료37', en: 'Done 37' },
    sessionNumber: 3,
    sessionType: 'REGULAR',
    riskType: 'STABLE',
  },
  {
    id: 15538,
    date: '2026-03-03',
    time: '10:10',
    names: { ko: '완료38', en: 'Done 38' },
    sessionNumber: 6,
    sessionType: 'REGULAR',
    riskType: 'CAUTION',
  },
  {
    id: 15539,
    date: '2026-03-03',
    time: '11:30',
    names: { ko: '완료39', en: 'Done 39' },
    sessionNumber: 2,
    sessionType: 'INITIAL',
    riskType: 'STABLE',
  },
  {
    id: 15540,
    date: '2026-03-03',
    time: '13:10',
    names: { ko: '완료40', en: 'Done 40' },
    sessionNumber: 9,
    sessionType: 'REGULAR',
    riskType: 'RISK',
  },
  {
    id: 15541,
    date: '2026-03-03',
    time: '14:40',
    names: { ko: '완료41', en: 'Done 41' },
    sessionNumber: 1,
    sessionType: 'CRISIS',
    riskType: 'CAUTION',
  },
];

const withDate = (base: MockSessionItem, date: string, offset: number): MockSessionItem => ({
  ...base,
  id: Number(`${base.id}${String(offset + 1).padStart(2, '0')}`),
  date,
});

const createScheduledMock = (locale: Locale) =>
  MARCH_2026_DATES.flatMap((date, index) =>
    SCHEDULED_BASE.slice(0, getMockItemCount(date)).map((item, itemIndex) => {
      const next = withDate(item, date, index);
      return {
        id: next.id + itemIndex,
        scheduledAt: `${next.date}T${next.time}:00`,
        clientName: locale === 'en' ? next.names.en : next.names.ko,
        sessionNumber: next.sessionNumber,
        sessionType: next.sessionType,
        riskType: next.riskType,
        contact: '010-0000-0000',
      };
    }),
  );

const createCompletedMock = (locale: Locale) =>
  MARCH_2026_DATES.flatMap((date, index) =>
    COMPLETED_BASE.slice(0, getMockItemCount(date)).map((item, itemIndex) => {
      const next = withDate(item, date, index);
      return {
        id: next.id + itemIndex,
        date: `${next.date}T${next.time}:00`,
        clientName: locale === 'en' ? next.names.en : next.names.ko,
        sessionNumber: next.sessionNumber,
        sessionType: next.sessionType,
        riskType: next.riskType,
        summary: locale === 'en' ? 'Stable progress observed.' : '전반적으로 안정적인 상담 진행.',
      };
    }),
  );

export const buildSessionListMockEnvelope = (
  status: SessionStatus,
  locale: Locale,
): SessionListMockEnvelope => ({
  code: 'SUCCESS',
  message: '요청이 성공적으로 처리되었습니다',
  data:
    status === 'completed'
      ? { completedSessions: createCompletedMock(locale) }
      : { scheduledSessions: createScheduledMock(locale) },
});
