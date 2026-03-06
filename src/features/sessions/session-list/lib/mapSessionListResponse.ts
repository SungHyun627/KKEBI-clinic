import type { SessionListResponse, SessionStatus } from '../types/session-list';
import type { RiskType, SessionType } from '@/features/dashboard/types/schedule';
import type { CompletedSessionGroup, ScheduledSessionGroup } from '../types/session-list';

type BackendSessionItem = {
  id?: number;
  scheduledAt?: string;
  date?: string;
  clientName?: string;
  sessionNumber?: number;
  sessionType?: string;
  riskType?: string;
};

type BackendSessionListEnvelope = {
  code?: string;
  message?: string;
  data?: {
    scheduledSessions?: BackendSessionItem[];
    completedSessions?: BackendSessionItem[];
  };
};

const toSessionType = (value?: string): SessionType => {
  if (!value) return '정기';
  const normalized = value.trim().toUpperCase();
  if (normalized === 'INITIAL' || value.includes('초기')) return '초기';
  if (normalized === 'CRISIS' || value.includes('위기')) return '위기';
  if (normalized === 'REGULAR' || value.includes('정기')) return '정기';
  return '정기';
};

const toRiskType = (value?: string): RiskType => {
  if (!value) return '안정';
  const normalized = value.trim().toUpperCase();
  if (normalized === 'CAUTION' || value.includes('주의')) return '주의';
  if (normalized === 'RISK' || value.includes('위험')) return '위험';
  if (normalized === 'STABLE' || value.includes('안정')) return '안정';
  return '안정';
};

const splitDateTime = (value?: string) => {
  if (!value) return { date: '', time: '10:00' };
  const [rawDate, rawTime = '10:00:00'] = value.split('T');
  const time = rawTime.slice(0, 5) || '10:00';
  return { date: rawDate ?? '', time };
};

export const mapBackendSessionListResponse = (
  payload: unknown,
  status: SessionStatus,
): SessionListResponse | null => {
  if (!payload || typeof payload !== 'object') return null;
  const envelope = payload as BackendSessionListEnvelope;
  const backendData = envelope.data;
  if (!backendData || typeof backendData !== 'object') {
    return {
      success: true,
      status,
      data: [],
      message: envelope.message,
    };
  }

  if (status === 'scheduled') {
    const source = Array.isArray(backendData.scheduledSessions)
      ? backendData.scheduledSessions
      : [];
    const groupMap = new Map<string, ScheduledSessionGroup>();
    source.forEach((item, index) => {
      const { date, time } = splitDateTime(item.scheduledAt);
      if (!date) return;
      const existing = groupMap.get(date);
      const scheduledItem = {
        id: String(item.id ?? `${date}-${index}`),
        clientId: String(item.id ?? `${date}-${index}`),
        clientName: item.clientName ?? '-',
        streakDays: item.sessionNumber ?? 0,
        scheduledTime: time,
        sessionType: toSessionType(item.sessionType),
        moodScore: null,
        stressScore: null,
        riskType: toRiskType(item.riskType),
      };
      if (!existing) {
        groupMap.set(date, { date, items: [scheduledItem] });
        return;
      }
      existing.items.push(scheduledItem);
    });

    return {
      success: true,
      status: 'scheduled',
      data: Array.from(groupMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
      message: envelope.message,
    };
  }

  const source = Array.isArray(backendData.completedSessions) ? backendData.completedSessions : [];
  const groupMap = new Map<string, CompletedSessionGroup>();
  source.forEach((item, index) => {
    const { date } = splitDateTime(item.date);
    if (!date) return;
    const existing = groupMap.get(date);
    const completedItem = {
      id: String(item.id ?? `${date}-${index}`),
      clientId: String(item.id ?? `${date}-${index}`),
      clientName: item.clientName ?? '-',
      counselingDate: date,
      counselingDurationMinutes: 50,
    };
    if (!existing) {
      groupMap.set(date, { date, items: [completedItem] });
      return;
    }
    existing.items.push(completedItem);
  });

  return {
    success: true,
    status: 'completed',
    data: Array.from(groupMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
    message: envelope.message,
  };
};
