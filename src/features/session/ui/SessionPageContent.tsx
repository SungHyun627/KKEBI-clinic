'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import SessionHeader from './SessionHeader';
import SessionInsightsPanel from './SessionInsightsPanel';
import SessionAutoRecordPanel from './SessionAutoRecordPanel';
import { getSessionPageData } from '../api/getSessionPageData';
import type { SessionPageData } from '../types/session-page';

interface SessionPageContentProps {
  sessionId: string;
}

export default function SessionPageContent({ sessionId }: SessionPageContentProps) {
  const locale = useLocale();
  const [data, setData] = useState<SessionPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recorderState, setRecorderState] = useState({
    isRecording: false,
    isPaused: false,
    elapsedSeconds: 0,
    visibleAudioLevel: 0,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getSessionPageData(sessionId, locale);
      if (!result.success || !result.data) {
        setError(result.message || 'Failed to load session data');
        setData(null);
        setLoading(false);
        return;
      }
      setData(result.data);
      setError(null);
      setLoading(false);
    };

    void load();
  }, [sessionId, locale]);

  return (
    <section className="flex min-h-[calc(100dvh)] w-full flex-col gap-5 bg-white">
      <SessionHeader
        sessionId={sessionId}
        sessionData={
          data
            ? {
                clientName: data.clientName,
                sessionType: data.sessionType,
                riskType: data.riskType,
              }
            : undefined
        }
        recorderState={recorderState}
      />
      {loading ? (
        <div className="flex min-h-[320px] items-center justify-center body-14 text-label-alternative">
          Loading session data...
        </div>
      ) : error || !data ? (
        <div className="flex min-h-[320px] items-center justify-center body-14 text-status-negative">
          {error ?? 'Failed to load session data'}
        </div>
      ) : (
        <div className="grid w-full flex-1 grid-cols-[1fr_1.5fr] gap-[34px]">
          <SessionInsightsPanel insights={data.insights} isRecording={recorderState.isRecording} />
          <SessionAutoRecordPanel
            sessionId={sessionId}
            autoRecord={data.autoRecord}
            onRecorderStateChange={setRecorderState}
          />
        </div>
      )}
    </section>
  );
}
