'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SessionAutoRecordData } from '../types/session-page';
import { addTranscriptBookmark, removeTranscriptBookmark } from '../api/bookmarkTranscript';
import { toast } from '@/shared/ui/toast';
import { getDemoConversation } from '../lib/demo-conversations';
import { formatElapsedToTimestamp } from '../lib/session-analysis';
import { useSessionPersistence } from './useSessionPersistence';
import { getSessionAutoRecordStorageKey } from '../lib/session-storage';

export type MicPermissionState = 'idle' | 'requesting' | 'granted' | 'denied';

type PersistedAutoRecordState = {
  transcriptItems: SessionAutoRecordData['transcripts'];
  bookmarkIds: string[];
  micPermission: MicPermissionState;
  isRecording: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  audioLevel: number;
  demoIndex: number;
};

interface UseSessionAutoRecordRuntimeParams {
  sessionId: string;
  locale: string;
  onRiskSignalDetected?: (payload: { text: string; timestamp: string }) => void;
}

export function useSessionAutoRecordRuntime({
  sessionId,
  locale,
  onRiskSignalDetected,
}: UseSessionAutoRecordRuntimeParams) {
  const tSession = useTranslations('sessionList');
  const [transcriptItems, setTranscriptItems] = useState<SessionAutoRecordData['transcripts']>([]);
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(() => new Set());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [micPermission, setMicPermission] = useState<MicPermissionState>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [demoIndex, setDemoIndex] = useState(0);

  const pendingMap = useMemo(() => pendingIds, [pendingIds]);
  const visibleAudioLevel = isRecording && !isPaused ? audioLevel : 0;
  const storageKey = getSessionAutoRecordStorageKey(sessionId);
  const snapshot = useMemo<PersistedAutoRecordState>(
    () => ({
      transcriptItems,
      bookmarkIds: Array.from(bookmarkIds),
      micPermission,
      isRecording,
      isPaused,
      elapsedSeconds,
      audioLevel,
      demoIndex,
    }),
    [
      audioLevel,
      bookmarkIds,
      demoIndex,
      elapsedSeconds,
      isPaused,
      isRecording,
      micPermission,
      transcriptItems,
    ],
  );

  const hydrate = useCallback((parsed: PersistedAutoRecordState) => {
    setTranscriptItems(parsed.transcriptItems ?? []);
    setBookmarkIds(new Set(parsed.bookmarkIds ?? []));
    setMicPermission(parsed.micPermission ?? 'idle');
    setIsRecording(Boolean(parsed.isRecording));
    setIsPaused(Boolean(parsed.isPaused));
    setElapsedSeconds(parsed.elapsedSeconds ?? 0);
    setAudioLevel(parsed.audioLevel ?? 0);
    setDemoIndex(parsed.demoIndex ?? 0);
  }, []);

  const { isHydrated } = useSessionPersistence<PersistedAutoRecordState>({
    storageKey,
    snapshot,
    hydrate,
  });

  useEffect(() => {
    if (!isHydrated || !isRecording || isPaused) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isHydrated, isPaused, isRecording]);

  useEffect(() => {
    if (!isHydrated || !isRecording || isPaused) return;

    const levelTimer = window.setInterval(() => {
      setAudioLevel(Math.floor(Math.random() * 100));
    }, 250);

    return () => window.clearInterval(levelTimer);
  }, [isHydrated, isPaused, isRecording]);

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
      toast(tSession('toastMicUnsupported'));
      return;
    }

    setMicPermission('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission('granted');
      setIsRecording(true);
      setIsPaused(false);
    } catch {
      setMicPermission('denied');
      toast(tSession('toastMicPermissionDenied'));
    }
  };

  const handlePauseResume = () => {
    if (!isRecording) return;
    setIsPaused((prev) => !prev);
  };

  const handlePrepareEndSession = useCallback(() => {
    if (!isRecording) return;
    setIsPaused(true);
    setAudioLevel(0);
  }, [isRecording]);

  const handleAddDemoDialogue = () => {
    const list = getDemoConversation(locale);
    const dialogue = list[demoIndex % list.length];
    setDemoIndex((prev) => prev + 1);

    const transcriptId = `${sessionId}-demo-${Date.now()}`;
    const timestamp = formatElapsedToTimestamp(elapsedSeconds);
    const newItem: SessionAutoRecordData['transcripts'][number] = {
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
    }
  };

  return {
    transcriptItems,
    bookmarkIds,
    pendingIds,
    micPermission,
    isRecording,
    isPaused,
    elapsedSeconds,
    visibleAudioLevel,
    toggleBookmark,
    handleStartRecording,
    handlePauseResume,
    handlePrepareEndSession,
    handleAddDemoDialogue,
  };
}
