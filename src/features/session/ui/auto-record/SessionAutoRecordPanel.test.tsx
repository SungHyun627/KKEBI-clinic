/** @vitest-environment jsdom */

import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SessionAutoRecordPanel from './SessionAutoRecordPanel';
import type { SessionAutoRecordData, SessionInsightsData } from '../../model/types';

const mockUseRecordingController = vi.fn();
const mockUseTranscriptRuntime = vi.fn();
const mockUseSessionInsightsStream = vi.fn();
const mockUseAudioChunkUploader = vi.fn();

vi.mock('../../hooks/useRecordingController', () => ({
  useRecordingController: (...args: unknown[]) => mockUseRecordingController(...args),
}));

vi.mock('../../hooks/useTranscriptRuntime', () => ({
  useTranscriptRuntime: (...args: unknown[]) => mockUseTranscriptRuntime(...args),
}));

vi.mock('../../hooks/useSessionInsightsStream', () => ({
  useSessionInsightsStream: (...args: unknown[]) => mockUseSessionInsightsStream(...args),
}));

vi.mock('../../hooks/useAudioChunkUploader', () => ({
  useAudioChunkUploader: (...args: unknown[]) => mockUseAudioChunkUploader(...args),
}));

vi.mock('../../hooks/useSessionPersistence', () => ({
  useSessionPersistence: vi.fn(),
}));

vi.mock('../../api/uploadFullAudioFile', () => ({
  uploadFullAudioFile: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/shared/lib/session-audio-preview-cache', () => ({
  setSessionAudioPreviewUrl: vi.fn(),
}));

vi.mock('@/shared/ui/toast', () => ({
  toast: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

vi.mock('next-intl', () => ({
  useLocale: () => 'ko',
  useTranslations: () => (key: string) => key,
}));

vi.mock('./session-transcript-highlight', () => ({
  renderHighlightedText: vi.fn((text: string) => text),
}));

vi.mock('./SessionTranscriptCard', () => ({
  default: () => <div data-testid="transcript-card" />,
}));

vi.mock('./SessionLiveSummaryCard', () => ({
  default: () => <div data-testid="live-summary-card" />,
}));

vi.mock('./SessionCounselorMemoCard', () => ({
  default: () => <div data-testid="memo-card" />,
}));

vi.mock('./SessionAudioControls', () => ({
  default: () => <div data-testid="audio-controls" />,
}));

const baseInsights: SessionInsightsData = {
  currentEmotion: 'calm',
  confidence: 70,
  emotionHistory: [{ emotion: 'calm', minutesAgo: 0 }],
  phq9Score: 5,
  riskType: '안정',
  recentEmotionPattern: '기본',
  keyConcerns: [],
  distortionType: 'none',
  distortionExample: '',
};

const autoRecord: SessionAutoRecordData = {
  transcripts: [],
  liveSummaryTitle: '',
  liveSummaryBody: '',
  counselorMemo: '',
};

describe('SessionAutoRecordPanel integration', () => {
  let streamOnEvent: ((event: { type: string; data: unknown }) => void) | undefined;
  const upsertTranscriptFromSse = vi.fn();
  const addPendingTranscript = vi.fn(() => 'pending-1');
  const resolvePendingTranscript = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    streamOnEvent = undefined;

    mockUseRecordingController.mockReturnValue({
      micPermission: 'granted',
      fastApiSessionId: 'fastapi-1',
      isStartingSession: false,
      isRecording: true,
      isPaused: false,
      elapsedSeconds: 8,
      audioLevel: 0,
      visibleAudioLevel: 0,
      handleStartRecording: vi.fn(),
      handlePauseResume: vi.fn(),
      handlePrepareEndSession: vi.fn(),
      setMicPermission: vi.fn(),
      setFastApiSessionId: vi.fn(),
      setIsRecording: vi.fn(),
      setIsPaused: vi.fn(),
      setElapsedSeconds: vi.fn(),
      setAudioLevel: vi.fn(),
    });

    mockUseTranscriptRuntime.mockReturnValue({
      transcriptItems: [],
      demoIndex: 0,
      bookmarkIds: new Set<string>(),
      bookmarkIdByTranscriptId: {},
      pendingIds: new Set<string>(),
      addPendingTranscript,
      resolvePendingTranscript,
      toggleBookmark: vi.fn(),
      upsertTranscriptFromSse,
      setTranscriptItems: vi.fn(),
      setDemoIndex: vi.fn(),
      setBookmarkIds: vi.fn(),
      setBookmarkIdByTranscriptId: vi.fn(),
    });

    mockUseAudioChunkUploader.mockReturnValue({
      uploadChunk: vi.fn().mockResolvedValue({ success: false }),
      lastErrorMessage: null,
    });

    mockUseSessionInsightsStream.mockImplementation(
      (params: { onEvent?: typeof streamOnEvent }) => {
        streamOnEvent = params.onEvent;
        return { status: 'open', retryCount: 0, errorMessage: null };
      },
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('SSE 이벤트를 받아 transcript/analysis 업데이트를 반영한다', async () => {
    const onAnalysisChange = vi.fn();

    render(
      <SessionAutoRecordPanel
        sessionId="session-10"
        autoRecord={autoRecord}
        baseInsights={baseInsights}
        onAnalysisChange={onAnalysisChange}
      />,
    );

    act(() => {
      streamOnEvent?.({
        type: 'insight',
        data: {
          data: {
            transcriptId: 17,
            text: '오늘 너무 불안했어요',
            speaker: 'client',
            timestamp: '00:01:00',
            current_emotion: 'fear',
            phq9Score: 13,
          },
        },
      });
    });

    await waitFor(() => {
      expect(upsertTranscriptFromSse).toHaveBeenCalledWith({
        transcriptId: 17,
        text: '오늘 너무 불안했어요',
        speaker: 'client',
        timestamp: '00:01:00',
      });
      expect(onAnalysisChange).toHaveBeenCalledWith({
        currentEmotion: 'fearful',
        phq9Score: 13,
        distortionType: undefined,
        distortionExample: undefined,
      });
    });
  });

  it('녹음 중 Space 입력 시 화자 전환 로직을 호출한다', async () => {
    render(
      <SessionAutoRecordPanel
        sessionId="session-11"
        autoRecord={autoRecord}
        baseInsights={baseInsights}
      />,
    );

    fireEvent.keyDown(window, { code: 'Space', key: ' ' });

    await waitFor(() => {
      expect(addPendingTranscript).toHaveBeenCalledTimes(1);
      expect(resolvePendingTranscript).toHaveBeenCalledWith({
        pendingId: 'pending-1',
        text: 'noAudioCapturedSwitchSpeaker',
      });
    });
  });

  it('입력 요소 포커스에서는 Space 단축키를 무시한다', async () => {
    render(
      <SessionAutoRecordPanel
        sessionId="session-12"
        autoRecord={autoRecord}
        baseInsights={baseInsights}
      />,
    );
    const input = document.createElement('input');
    document.body.appendChild(input);

    fireEvent.keyDown(input, { code: 'Space', key: ' ' });
    await Promise.resolve();

    expect(addPendingTranscript).not.toHaveBeenCalled();
  });
});
