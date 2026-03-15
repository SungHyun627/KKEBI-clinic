'use client';

import { useMemo, useState } from 'react';
import type { SessionAutoRecordData } from '../model/types';
import { getDemoConversation } from '../model/demo-conversations';
import { formatElapsedToTimestamp } from '../model/analysis';
import { addTranscriptBookmark, removeTranscriptBookmark } from '../api/bookmarkTranscript';

interface UseTranscriptRuntimeParams {
  sessionId: string;
  locale: string;
  elapsedSeconds: number;
  onRiskSignalDetected?: (payload: { text: string; timestamp: string }) => void;
}

interface TranscriptSsePayload {
  transcriptId?: number;
  speaker?: 'counselor' | 'client';
  text?: string;
  timestamp?: string;
}

interface PendingTranscriptPayload {
  speaker: 'counselor' | 'client';
  timestamp: string;
  text: string;
}

interface ResolvePendingTranscriptPayload {
  pendingId: string;
  transcriptId?: number;
  text: string;
}

export const useTranscriptRuntime = ({
  sessionId,
  locale,
  elapsedSeconds,
  onRiskSignalDetected,
}: UseTranscriptRuntimeParams) => {
  const [transcriptItems, setTranscriptItems] = useState<SessionAutoRecordData['transcripts']>([]);
  const [demoIndex, setDemoIndex] = useState(0);
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(() => new Set());
  const [bookmarkIdByTranscriptId, setBookmarkIdByTranscriptId] = useState<Record<string, number>>(
    {},
  );
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const pendingMap = useMemo(() => pendingIds, [pendingIds]);

  const normalizeTranscriptTimestamp = (value?: string) => {
    if (typeof value !== 'string' || value.length === 0) {
      return formatElapsedToTimestamp(elapsedSeconds);
    }
    if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
    return formatElapsedToTimestamp(elapsedSeconds);
  };

  // Merge transcript item from SSE payload (append or patch existing item)
  const upsertTranscriptFromSse = (payload: TranscriptSsePayload) => {
    if (!payload.transcriptId) return;
    const text = payload.text;
    if (typeof text !== 'string') return;
    const id = String(payload.transcriptId);
    const speaker =
      payload.speaker === 'counselor' || payload.speaker === 'client' ? payload.speaker : 'client';
    const timestamp = normalizeTranscriptTimestamp(payload.timestamp);

    setTranscriptItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);
      if (existingIndex === -1) {
        return [
          ...prev,
          {
            id,
            transcriptId: payload.transcriptId,
            speaker,
            text,
            timestamp,
            bookmarked: bookmarkIds.has(id),
            bookmarkId: bookmarkIdByTranscriptId[id],
          },
        ];
      }

      const next = [...prev];
      next[existingIndex] = {
        ...next[existingIndex],
        transcriptId: payload.transcriptId,
        speaker,
        text,
        timestamp,
        bookmarkId: bookmarkIdByTranscriptId[id],
      };
      return next;
    });
  };

  const addBookmarkLocal = (transcriptId: string) => {
    setBookmarkIds((prev) => new Set(prev).add(transcriptId));
  };

  const addPendingTranscript = ({ speaker, timestamp, text }: PendingTranscriptPayload) => {
    const pendingId = `${sessionId}-pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setTranscriptItems((prev) => [
      ...prev,
      {
        id: pendingId,
        speaker,
        text,
        timestamp,
        bookmarked: false,
        isPendingTranscription: true,
      },
    ]);
    return pendingId;
  };

  const resolvePendingTranscript = ({
    pendingId,
    transcriptId,
    text,
  }: ResolvePendingTranscriptPayload) => {
    setTranscriptItems((prev) => {
      const pendingIndex = prev.findIndex((item) => item.id === pendingId);
      if (pendingIndex === -1) return prev;

      const next = [...prev];
      const resolvedId = typeof transcriptId === 'number' ? String(transcriptId) : null;
      const resolvedIndex =
        resolvedId !== null ? next.findIndex((item) => item.id === resolvedId) : -1;

      if (resolvedIndex >= 0) {
        next[resolvedIndex] = {
          ...next[resolvedIndex],
          text,
          isPendingTranscription: false,
        };
        next.splice(pendingIndex, 1);
        return next;
      }

      next[pendingIndex] = {
        ...next[pendingIndex],
        id: resolvedId ?? next[pendingIndex].id,
        transcriptId,
        text,
        bookmarkId: resolvedId
          ? bookmarkIdByTranscriptId[resolvedId]
          : next[pendingIndex].bookmarkId,
        isPendingTranscription: false,
      };
      return next;
    });
  };

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
      ? await removeTranscriptBookmark({
          sessionId,
          bookmarkId: bookmarkIdByTranscriptId[transcriptId],
        })
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
    } else if (isBookmarked) {
      setBookmarkIdByTranscriptId((prev) => {
        const next = { ...prev };
        delete next[transcriptId];
        return next;
      });
    } else if (result.bookmarkId) {
      setBookmarkIdByTranscriptId((prev) => ({
        ...prev,
        [transcriptId]: result.bookmarkId as number,
      }));
    }

    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(transcriptId);
      return next;
    });
  };

  const handleAddDemoDialogue = () => {
    const list = getDemoConversation(locale);
    const dialogue = list[demoIndex % list.length];
    setDemoIndex((prev) => prev + 1);

    const transcriptId = `${sessionId}-demo-${Date.now()}`;
    const timestamp = formatElapsedToTimestamp(elapsedSeconds);
    const newItem: SessionAutoRecordData['transcripts'][number] = {
      id: transcriptId,
      transcriptId: Number.isFinite(Number(transcriptId)) ? Number(transcriptId) : undefined,
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
      addBookmarkLocal(transcriptId);
      onRiskSignalDetected?.({ text: dialogue.text, timestamp });
    }

    return newItem;
  };

  return {
    transcriptItems,
    demoIndex,
    bookmarkIds,
    bookmarkIdByTranscriptId,
    pendingIds,
    addPendingTranscript,
    resolvePendingTranscript,
    toggleBookmark,
    handleAddDemoDialogue,
    upsertTranscriptFromSse,
    setTranscriptItems,
    setDemoIndex,
    setBookmarkIds,
    setBookmarkIdByTranscriptId,
  };
};
