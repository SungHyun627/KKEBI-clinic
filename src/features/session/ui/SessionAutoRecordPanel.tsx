'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import type { SessionAutoRecordData, SessionInsightsData } from '../types/session-page';
import { addTranscriptBookmark, removeTranscriptBookmark } from '../api/bookmarkTranscript';
import { toast } from '@/shared/ui/toast';
import SessionTranscriptCard from './SessionTranscriptCard';
import SessionLiveSummaryCard from './SessionLiveSummaryCard';
import SessionCounselorMemoCard from './SessionCounselorMemoCard';
import SessionAudioControls from './SessionAudioControls';

interface SessionAutoRecordPanelProps {
  sessionId: string;
  autoRecord: SessionAutoRecordData;
  baseInsights: SessionInsightsData;
  onRecorderStateChange?: (state: {
    isRecording: boolean;
    isPaused: boolean;
    elapsedSeconds: number;
    visibleAudioLevel: number;
  }) => void;
  onRiskSignalDetected?: (payload: { text: string; timestamp: string }) => void;
  onAnalysisChange?: (insights: SessionInsightsData | null) => void;
}

type MicPermissionState = 'idle' | 'requesting' | 'granted' | 'denied';

function formatTimestampToHms(value: string): string {
  const parts = value.split(':');
  if (parts.length === 3) return value;
  if (parts.length === 2) return `${value}:00`;
  return value;
}

function formatElapsedToTimestamp(seconds: number): string {
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function renderHighlightedText(text: string, locale: string) {
  const riskKeywords =
    locale === 'en'
      ? ['self-harm', 'suicide', 'give up', 'hard']
      : ['자해', '자살', '죽고 싶다', '힘들어', '포기'];

  const escaped = riskKeywords.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const matched = riskKeywords.some((keyword) => keyword.toLowerCase() === part.toLowerCase());
    if (!matched) return <span key={`${part}-${index}`}>{part}</span>;

    return (
      <span key={`${part}-${index}`} className="rounded-[4px] bg-[#FFE2E2] px-1 text-[#DB2C2C]">
        {part}
      </span>
    );
  });
}

function detectEmotionFromText(text: string): SessionInsightsData['currentEmotion'] {
  const lower = text.toLowerCase();
  const rules: Array<{ emotion: SessionInsightsData['currentEmotion']; keywords: string[] }> = [
    { emotion: 'anxious', keywords: ['불안', '초조', 'anxious', 'anxiety', 'nervous'] },
    { emotion: 'sad', keywords: ['슬프', '우울', 'sad', 'depressed'] },
    { emotion: 'angry', keywords: ['화나', '분노', 'angry', 'furious', 'irritated'] },
    { emotion: 'fearful', keywords: ['무섭', '두렵', 'fear', 'afraid', 'scared'] },
    { emotion: 'happy', keywords: ['기뻐', '좋아', 'happy', 'glad', 'relieved'] },
  ];

  const matched = rules.find((rule) => rule.keywords.some((keyword) => lower.includes(keyword)));
  return matched?.emotion ?? 'calm';
}

function detectDistortionType(texts: string[]): SessionInsightsData['distortionType'] {
  const joined = texts.join(' ').toLowerCase();
  if (/항상|절대|완전히|전혀|always|never|completely/.test(joined)) return 'black_and_white';
  if (/매번|언제나|모든 사람|아무도|every time|everyone|no one/.test(joined))
    return 'overgeneralization';
  if (/최악|끔찍|망했|재앙|worst|disaster|ruined/.test(joined)) return 'catastrophizing';
  return 'should_statement';
}

function buildLiveInsights(
  base: SessionInsightsData,
  transcripts: SessionAutoRecordData['transcripts'],
  locale: string,
): SessionInsightsData | null {
  if (transcripts.length === 0) return null;

  const clientLines = transcripts.filter((line) => line.speaker === 'client');
  const sourceLines = clientLines.length > 0 ? clientLines : transcripts;
  const latestText = sourceLines[sourceLines.length - 1]?.text ?? '';
  const texts = sourceLines.map((line) => line.text);
  const fullText = texts.join(' ').toLowerCase();

  const currentEmotion = detectEmotionFromText(latestText);
  const confidence = Math.max(62, Math.min(96, 68 + Math.min(texts.length, 6) * 4));

  const riskHits = (
    fullText.match(/자해|자살|죽고 싶|포기|self-harm|suicide|give up|want to die/g) ?? []
  ).length;
  const riskType = riskHits >= 2 ? '위험' : riskHits >= 1 ? '주의' : '안정';
  const phq9Score = riskType === '위험' ? 19 : riskType === '주의' ? 13 : 7;

  const recentClientLines = sourceLines.slice(-3);
  const emotionHistory = recentClientLines.map((line, idx) => ({
    emotion: detectEmotionFromText(line.text),
    minutesAgo: (recentClientLines.length - 1 - idx) * 3,
  }));

  const distortionType = detectDistortionType(texts);
  const distortionExample =
    texts
      .slice()
      .reverse()
      .find((line) => {
        const lower = line.toLowerCase();
        return (
          /항상|절대|완전히|전혀|always|never|completely/.test(lower) ||
          /매번|언제나|모든 사람|아무도|every time|everyone|no one/.test(lower) ||
          /최악|끔찍|망했|재앙|worst|disaster|ruined/.test(lower) ||
          /해야 해|하면 안 돼|should|must|have to/.test(lower)
        );
      }) ?? base.distortionExample;

  const concernsPool: Array<{ key: string; ko: string; en: string; test: RegExp }> = [
    {
      key: 'work',
      ko: '업무 스트레스',
      en: 'Work stress',
      test: /회사|업무|상사|work|boss|report/,
    },
    { key: 'sleep', ko: '수면 저하', en: 'Sleep decline', test: /잠|수면|sleep|insomnia/ },
    {
      key: 'safety',
      ko: '안전 위험',
      en: 'Safety risk',
      test: /자해|자살|죽고 싶|self-harm|suicide/,
    },
    { key: 'self', ko: '자기비난', en: 'Self-criticism', test: /실패|망했|failure|worthless/ },
  ];
  const keyConcerns = concernsPool
    .filter((item) => item.test.test(fullText))
    .map((item) => (locale === 'en' ? item.en : item.ko));

  return {
    ...base,
    currentEmotion,
    confidence,
    emotionHistory: emotionHistory.length > 0 ? emotionHistory : base.emotionHistory,
    phq9Score,
    riskType,
    recentEmotionPattern:
      locale === 'en'
        ? `Latest trend: ${currentEmotion} response is dominant`
        : `최근 패턴: ${currentEmotion === 'anxious' ? '불안' : currentEmotion === 'sad' ? '슬픔' : currentEmotion === 'angry' ? '분노' : currentEmotion === 'fearful' ? '두려움' : currentEmotion === 'happy' ? '기쁨' : '평온'} 반응이 우세`,
    keyConcerns: keyConcerns.length > 0 ? keyConcerns : base.keyConcerns,
    distortionType,
    distortionExample,
  };
}

export default function SessionAutoRecordPanel({
  sessionId,
  autoRecord,
  baseInsights,
  onRecorderStateChange,
  onRiskSignalDetected,
  onAnalysisChange,
}: SessionAutoRecordPanelProps) {
  const locale = useLocale();
  const [transcriptItems, setTranscriptItems] = useState(() => []);
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(() => new Set());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [micPermission, setMicPermission] = useState<MicPermissionState>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [demoIndex, setDemoIndex] = useState(0);
  const visibleAudioLevel = isRecording && !isPaused ? audioLevel : 0;

  const pendingMap = useMemo(() => pendingIds, [pendingIds]);

  useEffect(() => {
    if (!isRecording || isPaused) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPaused, isRecording]);

  useEffect(() => {
    onRecorderStateChange?.({
      isRecording,
      isPaused,
      elapsedSeconds,
      visibleAudioLevel,
    });
  }, [elapsedSeconds, isPaused, isRecording, onRecorderStateChange, visibleAudioLevel]);

  useEffect(() => {
    if (!onAnalysisChange) return;
    onAnalysisChange(buildLiveInsights(baseInsights, transcriptItems, locale));
  }, [baseInsights, locale, onAnalysisChange, transcriptItems]);

  useEffect(() => {
    if (!isRecording || isPaused) return;

    const levelTimer = window.setInterval(() => {
      setAudioLevel(Math.floor(Math.random() * 100));
    }, 250);

    return () => window.clearInterval(levelTimer);
  }, [isPaused, isRecording]);

  const toggleBookmark = async (transcriptId: string) => {
    if (pendingMap.has(transcriptId)) return;
    const isBookmarked = bookmarkIds.has(transcriptId);

    setPendingIds((prev) => new Set(prev).add(transcriptId));
    setBookmarkIds((prev) => {
      const next = new Set(prev);
      if (isBookmarked) {
        next.delete(transcriptId);
      } else {
        next.add(transcriptId);
      }
      return next;
    });

    const result = isBookmarked
      ? await removeTranscriptBookmark(sessionId, transcriptId)
      : await addTranscriptBookmark(sessionId, transcriptId);

    if (!result.success) {
      setBookmarkIds((prev) => {
        const next = new Set(prev);
        if (isBookmarked) {
          next.add(transcriptId);
        } else {
          next.delete(transcriptId);
        }
        return next;
      });
    }

    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(transcriptId);
      return next;
    });
  };

  const handleStartRecording = async () => {
    if (isRecording) return;
    if (!navigator?.mediaDevices?.getUserMedia) {
      toast(
        locale === 'en'
          ? 'Microphone is not supported in this browser.'
          : '브라우저에서 마이크를 지원하지 않습니다.',
      );
      return;
    }

    setMicPermission('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission('granted');
      setIsRecording(true);
      setIsPaused(false);
      toast(locale === 'en' ? 'Recording started.' : '녹음을 시작했습니다.');
    } catch {
      setMicPermission('denied');
      toast(
        locale === 'en'
          ? 'Microphone permission denied. Please allow microphone access.'
          : '마이크 권한이 거부되었습니다. 브라우저 권한을 허용해 주세요.',
      );
    }
  };

  const handlePauseResume = () => {
    if (!isRecording) return;
    setIsPaused((prev) => !prev);
  };

  const handleAddDemoDialogue = () => {
    const demoConversationKo: Array<{ speaker: 'counselor' | 'client'; text: string }> = [
      {
        speaker: 'counselor',
        text: '오늘은 지난주보다 표정이 조금 무거워 보이는데, 어떤 일이 있었나요?',
      },
      { speaker: 'client', text: '회사에서 매번 실수하는 것 같아서 너무 힘들어요.' },
      {
        speaker: 'counselor',
        text: '매번이라는 표현이 나왔네요. 최근에 특히 기억나는 순간이 있을까요?',
      },
      { speaker: 'client', text: '어제 보고서가 늦었는데, 상사가 이러면 망했다고 했어요.' },
      { speaker: 'counselor', text: '그 말을 들었을 때 몸이나 감정은 어떻게 반응했나요?' },
      {
        speaker: 'client',
        text: '심장이 빨리 뛰고, 저는 완전히 실패한 사람이라는 생각이 들었어요.',
      },
      { speaker: 'counselor', text: '그 생각이 들 때 스스로에게 어떤 말을 하게 되나요?' },
      { speaker: 'client', text: '절대 나아질 수 없고, 그냥 포기하고 싶다는 생각이 들어요.' },
      {
        speaker: 'counselor',
        text: '포기하고 싶은 마음이 커질 때, 자해나 자살 같은 생각도 함께 떠오르나요?',
      },
      {
        speaker: 'client',
        text: '가끔 자해 생각이 스쳐 지나가고, 죽고 싶다는 생각도 잠깐 들어요.',
      },
    ];
    const demoConversationEn: Array<{ speaker: 'counselor' | 'client'; text: string }> = [
      {
        speaker: 'counselor',
        text: 'You look a bit heavier than last week. What happened recently?',
      },
      { speaker: 'client', text: 'I feel like I fail at work every single time. It is hard.' },
      {
        speaker: 'counselor',
        text: 'I heard “every single time.” Can you share one recent moment?',
      },
      {
        speaker: 'client',
        text: 'My report was late yesterday, and I thought everything was ruined.',
      },
      {
        speaker: 'counselor',
        text: 'When you heard that, what happened in your body and emotions?',
      },
      {
        speaker: 'client',
        text: 'My heart raced and I felt like I was a complete failure.',
      },
      {
        speaker: 'counselor',
        text: 'When that thought appears, what do you say to yourself?',
      },
      {
        speaker: 'client',
        text: 'I feel I can never get better, and I just want to give up.',
      },
      {
        speaker: 'counselor',
        text: 'When that feeling grows, do self-harm or suicide thoughts come up too?',
      },
      {
        speaker: 'client',
        text: 'Sometimes self-harm thoughts pass by, and I briefly think about suicide.',
      },
    ];

    const list = locale === 'en' ? demoConversationEn : demoConversationKo;
    const dialogue = list[demoIndex % list.length];
    const nextIndex = demoIndex + 1;
    setDemoIndex(nextIndex);

    const transcriptId = `${sessionId}-demo-${Date.now()}`;
    const timestamp = formatElapsedToTimestamp(elapsedSeconds);
    const newItem = {
      id: transcriptId,
      speaker: dialogue.speaker,
      text: dialogue.text,
      timestamp,
      bookmarked: false,
    };

    setTranscriptItems((prev) => [...prev, newItem]);

    const hasRiskSignal =
      locale === 'en'
        ? /self-harm|suicide|want to die|give up|hard/i.test(dialogue.text)
        : /자해|자살|죽고 싶다|힘들어|포기/.test(dialogue.text);

    if (hasRiskSignal) {
      setBookmarkIds((prev) => new Set(prev).add(transcriptId));
      onRiskSignalDetected?.({ text: dialogue.text, timestamp });
      toast(
        locale === 'en'
          ? 'Risk signal detected in transcript.'
          : '전사에서 위험 신호가 감지되었습니다.',
      );
    }
  };

  return (
    <section className="relative flex min-h-full flex-col gap-[25px] bg-neutral-99 px-8 pt-[26px]">
      <div className="text-[24px] font-semibold">
        {locale === 'en' ? 'Session record' : '상담 기록'}
      </div>
      <div className="flex w-full flex-col items-start gap-4">
        <SessionTranscriptCard
          locale={locale}
          transcriptItems={transcriptItems}
          pendingIds={pendingIds}
          bookmarkIds={bookmarkIds}
          onToggleBookmark={(transcriptId) => {
            void toggleBookmark(transcriptId);
          }}
          formatTimestampToHms={formatTimestampToHms}
          renderHighlightedText={renderHighlightedText}
        />
        <SessionLiveSummaryCard
          locale={locale}
          title={isRecording ? autoRecord.liveSummaryTitle : ''}
          body={isRecording ? autoRecord.liveSummaryBody : ''}
        />
        <SessionCounselorMemoCard locale={locale} defaultValue={autoRecord.counselorMemo} />
      </div>
      <div className="fixed bottom-[30px] left-[40%] right-0 z-30 flex justify-center px-8 max-[1200px]:left-0 max-[1200px]:right-0 max-[1200px]:px-6 max-[900px]:px-4">
        <SessionAudioControls
          isRecording={isRecording}
          isPaused={isPaused}
          isStartDisabled={isRecording || micPermission === 'requesting'}
          isPauseDisabled={!isRecording}
          onStart={() => {
            void handleStartRecording();
          }}
          onPauseResume={handlePauseResume}
          onAddDemoDialogue={handleAddDemoDialogue}
        />
      </div>
    </section>
  );
}
