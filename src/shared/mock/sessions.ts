import type {
  CompletedSessionGroup,
  ScheduledSessionGroup,
} from '@/features/sessions/types/session-list';
import { getClientNameByLocale } from '@/shared/lib/clientNameByLocale';
import { TODAY_SCHEDULES_MOCK } from './today-schedules';

const SCHEDULED_DATES = ['2026-02-20', '2026-02-21'];
const COMPLETED_DATES = ['2026-02-18', '2026-02-19'];

const getDurationMinutes = (index: number) => {
  const durations = [40, 45, 50, 55];
  return durations[index % durations.length];
};

const scheduledSource = TODAY_SCHEDULES_MOCK.slice(0, 10);
const completedSource = TODAY_SCHEDULES_MOCK.slice(10, 20);

const getLocalizedClientName = (clientId: string, fallbackName: string, locale: string) =>
  getClientNameByLocale(clientId, fallbackName, locale);

const MARCH_3_DATE = '2026-03-03';

const MARCH_3_SCHEDULED_ITEMS = [
  {
    id: 'scheduled-march3-1',
    clientId: 'client-march3-kr',
    names: { ko: '김하늘', en: 'Haneul Kim' },
    streakDays: 7,
    scheduledTime: '10:30',
    sessionType: '초기' as const,
    moodScore: 4,
    stressScore: 3,
    riskType: '안정' as const,
  },
  {
    id: 'scheduled-march3-2',
    clientId: 'client-march3-en',
    names: { ko: '에밀리 박', en: 'Emily Park' },
    streakDays: 2,
    scheduledTime: '15:00',
    sessionType: '정기' as const,
    moodScore: 3,
    stressScore: 2,
    riskType: '주의' as const,
  },
];

const MARCH_3_COMPLETED_ITEMS = [
  {
    id: 'completed-march3-1',
    clientId: 'client-march3-done-kr',
    names: { ko: '이도윤', en: 'Doyoon Lee' },
    counselingDurationMinutes: 50,
  },
  {
    id: 'completed-march3-2',
    clientId: 'client-march3-done-en',
    names: { ko: '소피아 최', en: 'Sophia Choi' },
    counselingDurationMinutes: 45,
  },
];

export const SCHEDULED_SESSIONS_MOCK: ScheduledSessionGroup[] = SCHEDULED_DATES.map(
  (date, dateIndex) => ({
    date,
    items: scheduledSource
      .filter((_, index) => index % SCHEDULED_DATES.length === dateIndex)
      .map((item) => ({
        id: `scheduled-${item.id}`,
        clientId: item.clientId,
        clientName: item.clientName,
        streakDays: item.streakDays ?? 0,
        scheduledTime: item.time,
        sessionType: item.sessionType,
        moodScore: item.moodScore,
        stressScore: item.stressScore,
        riskType: item.riskType,
      })),
  }),
);

export const COMPLETED_SESSIONS_MOCK: CompletedSessionGroup[] = COMPLETED_DATES.map(
  (date, dateIndex) => ({
    date,
    items: completedSource
      .filter((_, index) => index % COMPLETED_DATES.length === dateIndex)
      .map((item, itemIndex) => ({
        id: `completed-${item.id}`,
        clientId: item.clientId,
        clientName: item.clientName,
        counselingDate: date,
        counselingDurationMinutes: getDurationMinutes(itemIndex + dateIndex),
      })),
  }),
);

export const getScheduledSessionsMock = (locale: string): ScheduledSessionGroup[] => [
  ...SCHEDULED_DATES.map((date, dateIndex) => ({
    date,
    items: scheduledSource
      .filter((_, index) => index % SCHEDULED_DATES.length === dateIndex)
      .map((item) => ({
        id: `scheduled-${item.id}`,
        clientId: item.clientId,
        clientName: getLocalizedClientName(item.clientId, item.clientName, locale),
        streakDays: item.streakDays ?? 0,
        scheduledTime: item.time,
        sessionType: item.sessionType,
        moodScore: item.moodScore,
        stressScore: item.stressScore,
        riskType: item.riskType,
      })),
  })),
  {
    date: MARCH_3_DATE,
    items: MARCH_3_SCHEDULED_ITEMS.map((item) => ({
      id: item.id,
      clientId: item.clientId,
      clientName: locale === 'en' ? item.names.en : item.names.ko,
      streakDays: item.streakDays,
      scheduledTime: item.scheduledTime,
      sessionType: item.sessionType,
      moodScore: item.moodScore,
      stressScore: item.stressScore,
      riskType: item.riskType,
    })),
  },
];

export const getCompletedSessionsMock = (locale: string): CompletedSessionGroup[] => [
  ...COMPLETED_DATES.map((date, dateIndex) => ({
    date,
    items: completedSource
      .filter((_, index) => index % COMPLETED_DATES.length === dateIndex)
      .map((item, itemIndex) => ({
        id: `completed-${item.id}`,
        clientId: item.clientId,
        clientName: getLocalizedClientName(item.clientId, item.clientName, locale),
        counselingDate: date,
        counselingDurationMinutes: getDurationMinutes(itemIndex + dateIndex),
      })),
  })),
  {
    date: MARCH_3_DATE,
    items: MARCH_3_COMPLETED_ITEMS.map((item) => ({
      id: item.id,
      clientId: item.clientId,
      clientName: locale === 'en' ? item.names.en : item.names.ko,
      counselingDate: MARCH_3_DATE,
      counselingDurationMinutes: item.counselingDurationMinutes,
    })),
  },
];
