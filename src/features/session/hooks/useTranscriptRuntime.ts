'use client';

import { useMemo, useState } from 'react';
import type { SessionAutoRecordData } from '../types/session';
import { getDemoConversation } from '../lib/demo-conversations';
import { formatElapsedToTimestamp } from '../lib/session-analysis';
import { addTranscriptBookmark, removeTranscriptBookmark } from '../api/bookmarkTranscript';

interface UseTranscriptRuntimeParams {
  sessionId: string;
  locale: string;
  elapsedSeconds: number;
  onRiskSignalDetected?: (payload: { text: string; timestamp: string }) => void;
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

  const addBookmarkLocal = (transcriptId: string) => {
    setBookmarkIds((prev) => new Set(prev).add(transcriptId));
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

    if (!hasRiskSignal) return;
    addBookmarkLocal(transcriptId);
    onRiskSignalDetected?.({ text: dialogue.text, timestamp });
  };

  return {
    transcriptItems,
    demoIndex,
    bookmarkIds,
    bookmarkIdByTranscriptId,
    pendingIds,
    toggleBookmark,
    handleAddDemoDialogue,
    setTranscriptItems,
    setDemoIndex,
    setBookmarkIds,
    setBookmarkIdByTranscriptId,
  };
};
