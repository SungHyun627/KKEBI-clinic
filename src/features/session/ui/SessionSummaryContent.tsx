'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { getSessionSummaryStorageKey } from '../lib/session-storage';

interface SessionSummaryContentProps {
  locale: string;
  sessionId: string;
  backLabel: string;
}

type SummaryPayload = {
  sessionId: string;
  endedAt: string;
  sessionData?: {
    clientName?: string;
  } | null;
  recorderState?: {
    elapsedSeconds?: number;
  } | null;
  runtime?: {
    transcriptItems?: Array<unknown>;
  } | null;
};

function formatElapsed(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function SessionSummaryContent({
  locale,
  sessionId,
  backLabel,
}: SessionSummaryContentProps) {
  const payload = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const raw = window.sessionStorage.getItem(getSessionSummaryStorageKey(sessionId));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SummaryPayload;
    } catch {
      return null;
    }
  }, [sessionId]);

  const transcriptCount = payload?.runtime?.transcriptItems?.length ?? 0;
  const duration = formatElapsed(payload?.recorderState?.elapsedSeconds ?? 0);
  const endedAt = payload?.endedAt ? new Date(payload.endedAt).toLocaleString(locale) : '-';

  return (
    <section className="flex min-h-[260px] w-full items-center justify-center rounded-2xl border border-neutral-95 bg-neutral-99 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-pretendard text-[22px] leading-[30px] font-semibold text-label-normal">
          {locale === 'en' ? 'Session Summary' : '상담 종료 요약'}
        </h2>
        <p className="body-14 text-label-alternative">
          {locale === 'en'
            ? 'This is a draft summary page after session end.'
            : '상담 종료 요약 페이지 초안입니다.'}
        </p>
        <code className="body-12 rounded-md bg-white px-2 py-1 text-neutral-60">
          id: {sessionId}
        </code>
        <code className="body-12 rounded-md bg-white px-2 py-1 text-neutral-60">
          client: {payload?.sessionData?.clientName ?? '-'}
        </code>
        <code className="body-12 rounded-md bg-white px-2 py-1 text-neutral-60">
          duration: {duration}
        </code>
        <code className="body-12 rounded-md bg-white px-2 py-1 text-neutral-60">
          transcriptCount: {transcriptCount}
        </code>
        <code className="body-12 rounded-md bg-white px-2 py-1 text-neutral-60">
          endedAt: {endedAt}
        </code>
        <Link
          href={`/${locale}/sessions`}
          className="mt-2 rounded-[10px] border border-neutral-95 bg-white px-4 py-2 body-14 text-label-normal hover:bg-neutral-99"
        >
          {backLabel}
        </Link>
      </div>
    </section>
  );
}
