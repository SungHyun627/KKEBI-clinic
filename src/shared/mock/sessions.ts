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

export const getScheduledSessionsMock = (locale: string): ScheduledSessionGroup[] =>
  SCHEDULED_DATES.map((date, dateIndex) => ({
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
  }));

export const getCompletedSessionsMock = (locale: string): CompletedSessionGroup[] =>
  COMPLETED_DATES.map((date, dateIndex) => ({
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
  }));
