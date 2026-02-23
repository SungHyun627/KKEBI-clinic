import type { RiskType, SessionType } from '@/features/dashboard/types/schedule';

export type SummaryPayload = {
  sessionId: string;
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
    distortionExampleHistory?: string[];
  } | null;
  runtime?: {
    transcriptItems?: SummaryTranscriptItem[];
    bookmarkIds?: string[];
  } | null;
};

export interface SummaryTranscriptItem {
  id?: string;
  speaker?: 'counselor' | 'client';
  text?: string;
  timestamp?: string;
}

export type RiskEvaluation = 'stable' | 'caution' | 'risk' | 'urgent';
export type NextSessionRecommendation = '1w' | '2w' | '1m' | 'as-needed';

export type MissionItem = {
  id: string;
  name: string;
  eta: string;
};

export const isSessionType = (value?: string): value is SessionType =>
  value === '초기' || value === '정기' || value === '위기';

export const isRiskType = (value?: string): value is RiskType =>
  value === '안정' || value === '주의' || value === '위험';
