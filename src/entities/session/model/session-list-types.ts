import type { RiskType, SessionType } from '@/entities/dashboard/model/types';

export type SessionStatus = 'scheduled' | 'completed';

export interface ScheduledSessionItem {
  id: string;
  clientId: string;
  clientName: string;
  streakDays: number;
  scheduledTime: string;
  sessionType: SessionType;
  moodScore: number | null;
  stressScore: number | null;
  riskType: RiskType;
}

export interface CompletedSessionItem {
  id: string;
  clientId: string;
  clientName: string;
  counselingDate: string;
  counselingDurationMinutes: number;
}

export interface ScheduledSessionGroup {
  date: string;
  items: ScheduledSessionItem[];
}

export interface CompletedSessionGroup {
  date: string;
  items: CompletedSessionItem[];
}

export interface ScheduledSessionsResponse {
  success: boolean;
  status: 'scheduled';
  data?: ScheduledSessionGroup[];
  message?: string;
}

export interface CompletedSessionsResponse {
  success: boolean;
  status: 'completed';
  data?: CompletedSessionGroup[];
  message?: string;
}

export type SessionListResponse = ScheduledSessionsResponse | CompletedSessionsResponse;
