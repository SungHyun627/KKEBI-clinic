import type { TodayScheduleItem } from '@/entities/dashboard/model/types';
import { TODAY_SCHEDULES_MOCK } from './today-schedules';

type ClientCloseReason = 'session-complete' | 'dropout' | 'other';
type ClosedClientReasonLabel = '회기 종료' | '중도 탈락' | '기타';

interface ClosedClientItem {
  id: string;
  clientId: string;
  counselingPeriod: string;
  clientName: string;
  ageGender: string;
  chiefConcern: string[];
  closeReason: ClosedClientReasonLabel;
}

const ACTIVE_SCHEDULES: TodayScheduleItem[] = TODAY_SCHEDULES_MOCK.map((item) => ({ ...item }));

const CLOSED_CLIENTS: ClosedClientItem[] = [
  {
    id: 'closed-1',
    clientId: 'client_2001',
    counselingPeriod: '2025/08/15 - 2026/01/28',
    clientName: '김하늘',
    ageGender: '남성 24세',
    chiefConcern: ['우울', '스트레스', '수면'],
    closeReason: '회기 종료',
  },
  {
    id: 'closed-2',
    clientId: 'client_2002',
    counselingPeriod: '2025/09/03 - 2026/01/20',
    clientName: '박민서',
    ageGender: '여성 31세',
    chiefConcern: ['불안', '대인관계', '번아웃'],
    closeReason: '중도 탈락',
  },
  {
    id: 'closed-3',
    clientId: 'client_2003',
    counselingPeriod: '2025/10/11 - 2026/02/02',
    clientName: '이준호',
    ageGender: '남성 28세',
    chiefConcern: ['공황', '수면'],
    closeReason: '기타',
  },
];

const closeReasonLabelByCode: Record<ClientCloseReason, ClosedClientReasonLabel> = {
  'session-complete': '회기 종료',
  dropout: '중도 탈락',
  other: '기타',
};

const sessionTypeByCloseReason: Record<ClosedClientReasonLabel, TodayScheduleItem['sessionType']> =
  {
    '회기 종료': '정기',
    '중도 탈락': '위기',
    기타: '초기',
  };

const riskTypeByCloseReason: Record<ClosedClientReasonLabel, TodayScheduleItem['riskType']> = {
  '회기 종료': '안정',
  '중도 탈락': '위험',
  기타: '주의',
};

const chiefConcernPool = [
  ['우울', '스트레스', '수면'],
  ['불안', '대인관계', '번아웃'],
  ['공황', '회피', '불면'],
  ['분노', '직장 갈등', '수면'],
  ['학업', '스트레스', '불안'],
] as const;

export const getActiveSchedules = (): TodayScheduleItem[] =>
  ACTIVE_SCHEDULES.map((item) => ({ ...item }));

export const getClosedClients = (): ClosedClientItem[] =>
  CLOSED_CLIENTS.map((item) => ({ ...item }));

export const findActiveClient = (clientId: string): TodayScheduleItem | null =>
  ACTIVE_SCHEDULES.find((item) => item.clientId === clientId) ?? null;

export const closeActiveClient = (
  clientId: string,
  reason: ClientCloseReason,
): ClosedClientItem | null => {
  const index = ACTIVE_SCHEDULES.findIndex((item) => item.clientId === clientId);
  if (index < 0) return null;

  const target = ACTIVE_SCHEDULES[index];
  ACTIVE_SCHEDULES.splice(index, 1);

  const idNumber = Number(clientId.replace(/\D/g, '')) || 0;
  const concern = chiefConcernPool[idNumber % chiefConcernPool.length];
  const closeReason = closeReasonLabelByCode[reason];
  const closedAt = new Date();
  const closedDate = formatDate(closedAt);
  const startDate = formatDate(
    new Date(closedAt.getFullYear(), Math.max(0, closedAt.getMonth() - 4), (idNumber % 27) + 1),
  );
  const age = 24 + (idNumber % 15);
  const gender = idNumber % 2 === 0 ? '여성' : '남성';

  const closedItem: ClosedClientItem = {
    id: `closed-${clientId}-${closedAt.getTime()}`,
    clientId,
    counselingPeriod: `${startDate} - ${closedDate}`,
    clientName: target.clientName,
    ageGender: `${gender} ${age}세`,
    chiefConcern: [...concern],
    closeReason,
  };

  CLOSED_CLIENTS.unshift(closedItem);
  return { ...closedItem };
};

export const restoreClosedClient = (clientId: string): TodayScheduleItem | null => {
  const index = CLOSED_CLIENTS.findIndex((item) => item.clientId === clientId);
  if (index < 0) return null;

  const target = CLOSED_CLIENTS[index];
  CLOSED_CLIENTS.splice(index, 1);

  const restoredSchedule: TodayScheduleItem = {
    id: `schedule-restored-${clientId}`,
    time: pickRestoredTime(ACTIVE_SCHEDULES.length),
    clientId: target.clientId,
    clientName: target.clientName,
    sessionType: sessionTypeByCloseReason[target.closeReason],
    riskType: riskTypeByCloseReason[target.closeReason],
    moodScore: target.closeReason === '중도 탈락' ? 2 : target.closeReason === '기타' ? 3 : 4,
    stressScore: target.closeReason === '중도 탈락' ? 5 : target.closeReason === '기타' ? 3 : 2,
    streakDays: target.closeReason === '중도 탈락' ? 1 : 5,
  };

  ACTIVE_SCHEDULES.push(restoredSchedule);
  ACTIVE_SCHEDULES.sort((a, b) => a.time.localeCompare(b.time));
  return { ...restoredSchedule };
};

function pickRestoredTime(count: number): string {
  const baseHour = 9 + (count % 10);
  const minute = count % 2 === 0 ? '00' : '30';
  return `${String(baseHour).padStart(2, '0')}:${minute}`;
}

function formatDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const date = String(value.getDate()).padStart(2, '0');
  return `${year}/${month}/${date}`;
}
