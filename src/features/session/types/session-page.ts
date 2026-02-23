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

export interface SessionPageData {
  sessionId: string;
  clientId: string;
  clientName: string;
  sessionType: SessionType;
  riskType: RiskType;
  insights: SessionInsightsData;
  autoRecord: SessionAutoRecordData;
}

export interface SessionPageResponse {
  success: boolean;
  data?: SessionPageData;
  message?: string;
}
