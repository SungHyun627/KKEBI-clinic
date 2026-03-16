export type SessionEmotionType = 'anxious' | 'sad' | 'angry' | 'happy' | 'calm' | 'fearful';

export type CognitiveDistortionType =
  | 'catastrophizing'
  | 'should_statement'
  | 'black_and_white'
  | 'overgeneralization'
  | 'none';

export interface SessionTranscriptItem {
  id: string;
  speaker: 'counselor' | 'client';
  text: string;
  timestamp: string;
  bookmarked?: boolean;
}

export interface SessionPageViewData {
  sessionId: string;
  clientId: string;
  clientName: string;
  sessionType: '초기' | '정기' | '위기';
  riskType: '안정' | '주의' | '위험';
  scheduledAt: string;
  sessionNumber: number;
  contact: string;
  insights: {
    currentEmotion: SessionEmotionType;
    confidence: number;
    emotionHistory: Array<{ minutesAgo: number; emotion: SessionEmotionType }>;
    phq9Score: number;
    riskType: '안정' | '주의' | '위험';
    recentEmotionPattern: string;
    keyConcerns: string[];
    distortionType: CognitiveDistortionType;
    distortionExample: string;
  };
  autoRecord: {
    transcripts: SessionTranscriptItem[];
    liveSummaryTitle: string;
    liveSummaryBody: string;
    counselorMemo: string;
  };
}
