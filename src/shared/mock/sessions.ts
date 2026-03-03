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

const MARCH_2026_DATES = Array.from({ length: 31 }, (_, index) => {
  const day = String(index + 1).padStart(2, '0');
  return `2026-03-${day}`;
});

const getMarchMockItemCount = (date: string) => {
  const day = Number(date.split('-')[2]);
  const pattern = [3, 4, 5];
  return pattern[(day - 1) % pattern.length];
};

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
  {
    id: 'scheduled-march3-3',
    clientId: 'client-march3-kr-2',
    names: { ko: '박서준', en: 'Seojun Park' },
    streakDays: 5,
    scheduledTime: '11:40',
    sessionType: '정기' as const,
    moodScore: 2,
    stressScore: 4,
    riskType: '주의' as const,
  },
  {
    id: 'scheduled-march3-4',
    clientId: 'client-march3-en-2',
    names: { ko: '클로이 정', en: 'Chloe Jung' },
    streakDays: 1,
    scheduledTime: '13:20',
    sessionType: '초기' as const,
    moodScore: 5,
    stressScore: 1,
    riskType: '안정' as const,
  },
  {
    id: 'scheduled-march3-5',
    clientId: 'client-march3-kr-3',
    names: { ko: '최민아', en: 'Mina Choi' },
    streakDays: 9,
    scheduledTime: '17:10',
    sessionType: '정기' as const,
    moodScore: 3,
    stressScore: 3,
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
  {
    id: 'completed-march3-3',
    clientId: 'client-march3-done-kr-2',
    names: { ko: '정유진', en: 'Yujin Jung' },
    counselingDurationMinutes: 55,
  },
  {
    id: 'completed-march3-4',
    clientId: 'client-march3-done-en-2',
    names: { ko: '올리비아 김', en: 'Olivia Kim' },
    counselingDurationMinutes: 40,
  },
  {
    id: 'completed-march3-5',
    clientId: 'client-march3-done-kr-3',
    names: { ko: '한지호', en: 'Jiho Han' },
    counselingDurationMinutes: 60,
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
  ...MARCH_2026_DATES.map((date) => {
    const itemCount = getMarchMockItemCount(date);
    return {
      date,
      items: MARCH_3_SCHEDULED_ITEMS.slice(0, itemCount).map((item) => ({
        id: `${item.id}-${date}`,
        clientId: `${item.clientId}-${date}`,
        clientName: locale === 'en' ? item.names.en : item.names.ko,
        streakDays: item.streakDays,
        scheduledTime: item.scheduledTime,
        sessionType: item.sessionType,
        moodScore: item.moodScore,
        stressScore: item.stressScore,
        riskType: item.riskType,
      })),
    };
  }),
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
  ...MARCH_2026_DATES.map((date) => {
    const itemCount = getMarchMockItemCount(date);
    return {
      date,
      items: MARCH_3_COMPLETED_ITEMS.slice(0, itemCount).map((item) => ({
        id: `${item.id}-${date}`,
        clientId: `${item.clientId}-${date}`,
        clientName: locale === 'en' ? item.names.en : item.names.ko,
        counselingDate: date,
        counselingDurationMinutes: item.counselingDurationMinutes,
      })),
    };
  }),
];
