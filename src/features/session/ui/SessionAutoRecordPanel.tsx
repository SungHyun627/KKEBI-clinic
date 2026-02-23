'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import type { SessionAutoRecordData } from '../types/session-page';
import { addTranscriptBookmark, removeTranscriptBookmark } from '../api/bookmarkTranscript';
import { toast } from '@/shared/ui/toast';
import SessionTranscriptCard from './SessionTranscriptCard';
import SessionLiveSummaryCard from './SessionLiveSummaryCard';
import SessionCounselorMemoCard from './SessionCounselorMemoCard';
import SessionAudioControls from './SessionAudioControls';

interface SessionAutoRecordPanelProps {
  sessionId: string;
  autoRecord: SessionAutoRecordData;
  onRecorderStateChange?: (state: {
    isRecording: boolean;
    isPaused: boolean;
    elapsedSeconds: number;
    visibleAudioLevel: number;
  }) => void;
  onRiskSignalDetected?: (payload: { text: string; timestamp: string }) => void;
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

export default function SessionAutoRecordPanel({
  sessionId,
  autoRecord,
  onRecorderStateChange,
  onRiskSignalDetected,
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
      <div className="absolute bottom-[30px] left-0 right-0 z-30 flex justify-center px-8">
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
