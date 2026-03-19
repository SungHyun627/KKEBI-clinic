import { describe, expect, it } from 'vitest';
import {
  normalizeForSummary,
  parseSessionStreamEventData,
  resolveEmotionFromChunkResult,
  shouldTriggerSpeakerSwitchShortcut,
} from './session-auto-record-utils';

describe('session auto record utils', () => {
  describe('parseSessionStreamEventData', () => {
    it('data envelope에서 transcript/analysis patch를 파싱한다', () => {
      const result = parseSessionStreamEventData({
        data: {
          transcriptId: 101,
          text: '오늘은 업무 스트레스가 컸어요',
          speaker: 'CLIENT',
          timestamp: '00:10:10',
          current_emotion: 'fear',
          phq9Score: '14',
          distortion: JSON.stringify({
            distortionType: '과잉일반화',
            distortionSummary: '항상 실패한다고 느낀다',
          }),
        },
      });

      expect(result?.transcriptUpsert).toEqual({
        transcriptId: 101,
        text: '오늘은 업무 스트레스가 컸어요',
        speaker: 'client',
        timestamp: '00:10:10',
      });
      expect(result?.nextEmotion).toBe('fearful');
      expect(result?.analysisPatch).toEqual({
        currentEmotion: 'fearful',
        phq9Score: 14,
        distortionType: 'overgeneralization',
        distortionExample: '항상 실패한다고 느낀다',
      });
    });

    it('해석 가능한 값이 없으면 analysis patch를 만들지 않는다', () => {
      const result = parseSessionStreamEventData({
        transcriptId: 33,
        text: '안녕하세요',
        speaker: 'counselor',
      });

      expect(result?.transcriptUpsert).toEqual({
        transcriptId: 33,
        text: '안녕하세요',
        speaker: 'counselor',
        timestamp: undefined,
      });
      expect(result?.analysisPatch).toBeUndefined();
    });

    it('객체가 아니거나 비어 있으면 null을 반환한다', () => {
      expect(parseSessionStreamEventData(null)).toBeNull();
      expect(parseSessionStreamEventData('raw text')).toBeNull();
    });
  });

  describe('shouldTriggerSpeakerSwitchShortcut', () => {
    it('Space 또는 Enter 키에서 true를 반환한다', () => {
      expect(
        shouldTriggerSpeakerSwitchShortcut({
          code: 'Space',
          key: ' ',
          target: { tagName: 'DIV', isContentEditable: false },
        }),
      ).toBe(true);

      expect(
        shouldTriggerSpeakerSwitchShortcut({
          code: 'Enter',
          key: 'Enter',
          target: { tagName: 'SPAN', isContentEditable: false },
        }),
      ).toBe(true);
    });

    it('입력 가능한 요소에서는 단축키를 무시한다', () => {
      expect(
        shouldTriggerSpeakerSwitchShortcut({
          code: 'Space',
          key: ' ',
          target: { tagName: 'INPUT', isContentEditable: false },
        }),
      ).toBe(false);

      expect(
        shouldTriggerSpeakerSwitchShortcut({
          code: 'Enter',
          key: 'Enter',
          target: { tagName: 'DIV', isContentEditable: true },
        }),
      ).toBe(false);
    });

    it('IME 조합 중이거나 반복 입력이면 false를 반환한다', () => {
      expect(
        shouldTriggerSpeakerSwitchShortcut({
          code: 'Space',
          key: ' ',
          isComposing: true,
          target: { tagName: 'DIV', isContentEditable: false },
        }),
      ).toBe(false);

      expect(
        shouldTriggerSpeakerSwitchShortcut({
          code: 'Enter',
          key: 'Enter',
          repeat: true,
          target: { tagName: 'DIV', isContentEditable: false },
        }),
      ).toBe(false);
    });
  });

  describe('resolveEmotionFromChunkResult', () => {
    it('topEmotion이 있으면 우선 사용하고 confidence를 퍼센트로 변환한다', () => {
      const result = resolveEmotionFromChunkResult({
        topEmotion: 'happy',
        emotionProbs: { happy: 0.78, sad: 0.11 },
      });

      expect(result).toEqual({ emotion: 'happy', confidence: 78 });
    });

    it('topEmotion이 없어도 emotionProbs에서 최댓값을 사용한다', () => {
      const result = resolveEmotionFromChunkResult({
        emotionProbs: { neutral: 54, angry: 31 },
      });

      expect(result).toEqual({ emotion: 'calm', confidence: 54 });
    });
  });

  it('normalizeForSummary는 공백 정규화 및 길이 제한을 적용한다', () => {
    expect(normalizeForSummary('  안녕   하세요  ', 20)).toBe('안녕 하세요');
    expect(normalizeForSummary('1234567890', 5)).toBe('12345...');
  });
});
