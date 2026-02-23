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
}: SessionAutoRecordPanelProps) {
  const locale = useLocale();
  const [transcriptItems, setTranscriptItems] = useState(() => autoRecord.transcripts);
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(
    () => new Set(autoRecord.transcripts.filter((item) => item.bookmarked).map((item) => item.id)),
  );
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
    const demoTextsKo = [
      '최근 너무 힘들어서 포기하고 싶은 마음이 들어요.',
      '상담 중에는 그래도 숨을 고르면 조금 괜찮아져요.',
      '가끔 자해 생각이 떠올라서 걱정돼요.',
    ];
    const demoTextsEn = [
      'Lately I feel like giving up because things are too hard.',
      'During the session, breathing slowly helps me calm down.',
      'Sometimes I get self-harm thoughts and it scares me.',
    ];
    const list = locale === 'en' ? demoTextsEn : demoTextsKo;
    const text = list[demoIndex % list.length];
    const nextIndex = demoIndex + 1;
    setDemoIndex(nextIndex);

    const transcriptId = `${sessionId}-demo-${Date.now()}`;
    const newItem = {
      id: transcriptId,
      speaker: 'client' as const,
      text,
      timestamp: formatElapsedToTimestamp(elapsedSeconds),
      bookmarked: false,
    };

    setTranscriptItems((prev) => [...prev, newItem]);

    const hasRiskSignal =
      locale === 'en'
        ? /self-harm|suicide|give up|hard/i.test(text)
        : /자해|자살|죽고 싶다|힘들어|포기/.test(text);

    if (hasRiskSignal) {
      setBookmarkIds((prev) => new Set(prev).add(transcriptId));
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
          title={autoRecord.liveSummaryTitle}
          body={autoRecord.liveSummaryBody}
        />
        <SessionCounselorMemoCard locale={locale} defaultValue={autoRecord.counselorMemo} />
      </div>
      <div className="absolute bottom-[30px] left-8 right-8">
        <SessionAudioControls
          locale={locale}
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
