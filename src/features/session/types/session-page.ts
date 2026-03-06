import type { RiskType, SessionType } from '@/features/dashboard/types/schedule';

export type SessionEmotionType = 'anxious' | 'sad' | 'angry' | 'happy' | 'calm' | 'fearful';

export type CognitiveDistortionType =
  | 'black_and_white'
  | 'overgeneralization'
  | 'catastrophizing'
  | 'should_statement';

export interface SessionEmotionHistoryItem {
  emotion: SessionEmotionType;
  minutesAgo: number;
}

export interface SessionInsightsData {
  currentEmotion: SessionEmotionType;
  confidence: number;
  emotionHistory: SessionEmotionHistoryItem[];
  phq9Score: number;
  riskType: RiskType;
  recentEmotionPattern: string;
  keyConcerns: string[];
  distortionType: CognitiveDistortionType;
  distortionExample: string;
}

export interface SessionTranscriptItem {
  id: string;
  speaker: 'counselor' | 'client';
  text: string;
  timestamp: string;
  bookmarked?: boolean;
}

export interface SessionAutoRecordData {
  transcripts: SessionTranscriptItem[];
  liveSummaryTitle: string;
  liveSummaryBody: string;
  counselorMemo: string;
}

export interface SessionBasicInfo {
  scheduledAt: string;
  clientName: string;
  sessionNumber: number;
  sessionType: string;
  riskType: string;
  contact: string;
}

export interface SessionPageViewData {
  sessionId: string;
  clientId: string;
  clientName: string;
  sessionType: SessionType;
  riskType: RiskType;
  scheduledAt: string;
  sessionNumber: number;
  contact: string;
  insights: SessionInsightsData;
  autoRecord: SessionAutoRecordData;
}

export interface SessionInfoResponse {
  code: string;
  message: string;
  data?: SessionBasicInfo;
}

export const isSessionType = (value: string): value is SessionType =>
  value === '초기' || value === '정기' || value === '위기';

export const isRiskType = (value: string): value is RiskType =>
  value === '안정' || value === '주의' || value === '위험';
