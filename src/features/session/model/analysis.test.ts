import { describe, expect, it } from 'vitest';
import {
  analyzeLiveSummary,
  buildLiveInsights,
  formatElapsedToTimestamp,
  formatTimestampToHms,
} from './analysis';
import type { SessionInsightsData, SessionTranscriptItem } from './types';

const baseInsights: SessionInsightsData = {
  currentEmotion: 'calm',
  confidence: 80,
  emotionHistory: [{ emotion: 'calm', minutesAgo: 0 }],
  phq9Score: 6,
  riskType: '안정',
  recentEmotionPattern: '기본 패턴',
  keyConcerns: ['기본 고민'],
  distortionType: 'none',
  distortionExample: '',
};

const createTranscript = (
  id: string,
  speaker: SessionTranscriptItem['speaker'],
  text: string,
): SessionTranscriptItem => ({
  id,
  speaker,
  text,
  timestamp: '00:00:01',
});

describe('session analysis model', () => {
  it('타임스탬프 포맷 유틸이 정상 동작한다', () => {
    expect(formatElapsedToTimestamp(65)).toBe('00:01:05');
    expect(formatTimestampToHms('01:02')).toBe('01:02:00');
    expect(formatTimestampToHms('01:02:03')).toBe('01:02:03');
  });

  it('분석 가능한 대화가 부족하면 live summary를 생성하지 않는다', () => {
    const transcripts = [createTranscript('1', 'client', '짧음')];
    expect(analyzeLiveSummary(transcripts)).toBeNull();
  });

  it('위험 신호 텍스트를 기반으로 live summary를 생성한다', () => {
    const transcripts = [
      createTranscript('1', 'counselor', '최근 어떤 일이 있었나요?'),
      createTranscript('2', 'client', '회사 업무가 너무 힘들고 잠을 거의 못 자요.'),
      createTranscript('3', 'counselor', '그때 어떤 생각이 들었나요?'),
      createTranscript('4', 'client', '완전히 망했다고 느끼고 포기하고 싶어요.'),
      createTranscript('5', 'client', '가끔 죽고 싶다는 생각도 들어요.'),
    ];

    const result = analyzeLiveSummary(transcripts);
    expect(result).not.toBeNull();
    expect(result?.topicKeys).toEqual(expect.arrayContaining(['workStress', 'sleepIssues']));
    expect(result?.riskCount).toBeGreaterThan(0);
  });

  it('대화 기반으로 insights를 보정한다', () => {
    const transcripts = [
      createTranscript('1', 'client', 'I keep failing at work and feel overwhelmed.'),
      createTranscript('2', 'client', 'Sometimes I want to give up and think about self-harm.'),
    ];

    const result = buildLiveInsights(baseInsights, transcripts, 'en');
    expect(result).not.toBeNull();
    expect(result?.riskType).toBe('위험');
    expect(result?.phq9Score).toBe(19);
    expect(result?.keyConcerns).toEqual(expect.arrayContaining(['Work stress', 'Safety risk']));
    expect(result?.recentEmotionPattern).toContain('Latest trend');
  });
});
