import type { RiskType, SessionType } from '@/features/dashboard/types/schedule';

export type SummaryPayload = {
  sessionId?: number;
  endedAt: string;
  sessionData?: {
    clientName?: string;
    sessionType?: string;
    riskType?: string;
  } | null;
  recorderState?: {
    elapsedSeconds?: number;
  } | null;
  summarySnapshot?: {
    insights?: {
      riskType?: RiskType;
      keyConcerns?: string[];
      distortionType?: string;
    } | null;
    recentEmotionHistory?: string[];
    transcript?: SummaryTranscriptItem[];
    bookmarks?: SummaryBookmarkItem[];
    autoMemo?: string;
  } | null;
};

export interface SummaryTranscriptItem {
  id?: number;
  speaker?: 'counselor' | 'client';
  text?: string;
  timestamp?: string;
  isDanger?: boolean;
}

export interface SummaryBookmarkItem {
  id?: number;
  targetText?: string;
  memo?: string;
  timeOffset?: number;
}

export type RiskEvaluation = 'stable' | 'caution' | 'risk' | 'urgent';
export type FollowUpSessionTiming = '1w' | '2w' | '1m' | 'as-needed';
export type SummaryNextSessionSchedule = {
  date: string;
  startTime: string;
  endTime: string;
};

export type SummarySubmitFormValues = {
  riskEvaluation: RiskEvaluation | '';
  followUpSessionTiming: FollowUpSessionTiming | '';
  additionalMemo: string;
  selectedMissionIds: string[];
  nextDate: string;
  nextStartTime: string;
  nextEndTime: string;
};

export type SubmitSessionSummaryPayload = {
  summaryText: string;
  riskEvaluation: RiskEvaluation;
  followUpSessionTiming: FollowUpSessionTiming;
  selectedMissionIds: string[];
  nextSession: SummaryNextSessionSchedule | null;
};

export type SubmitSessionSummaryResponse = {
  success: boolean;
  message?: string;
};

export type SummaryApiResponse<TData = undefined> = {
  success: boolean;
  message?: string;
  data?: TData;
};

export type MissionItem = {
  id: string;
  name: string;
  category: string;
  duration: string;
};

export const isSessionType = (value?: string): value is SessionType =>
  value === '초기' || value === '정기' || value === '위기';

export const isRiskType = (value?: string): value is RiskType =>
  value === '안정' || value === '주의' || value === '위험';
