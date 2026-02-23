'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import SessionHeader from './SessionHeader';
import SessionInsightsPanel from './SessionInsightsPanel';
import SessionAutoRecordPanel from './SessionAutoRecordPanel';
import { getSessionPageData } from '../api/getSessionPageData';
import type { SessionEmotionType, SessionPageData } from '../types/session-page';

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
  const [riskBanner, setRiskBanner] = useState<{ text: string; timestamp: string } | null>(null);
  const [analysisInsights, setAnalysisInsights] = useState<SessionPageData['insights'] | null>(
    null,
  );
  const [recentEmotionHistory, setRecentEmotionHistory] = useState<SessionEmotionType[]>([]);
  const [keyConcernHistory, setKeyConcernHistory] = useState<string[]>([]);
  const [distortionExampleHistory, setDistortionExampleHistory] = useState<string[]>([]);

  const handleRiskSignalDetected = useCallback((payload: { text: string; timestamp: string }) => {
    setRiskBanner(payload);
  }, []);

  const handleAnalysisChange = useCallback((nextInsights: SessionPageData['insights'] | null) => {
    if (!nextInsights) return;
    setAnalysisInsights(nextInsights);

    setRecentEmotionHistory((prev) => {
      if (prev[0] === nextInsights.currentEmotion) return prev;
      return [nextInsights.currentEmotion, ...prev].slice(0, 6);
    });

    setKeyConcernHistory((prev) => {
      const merged = [...nextInsights.keyConcerns, ...prev];
      const deduped = merged.filter((item, index) => merged.indexOf(item) === index);
      return deduped.slice(0, 8);
    });

    setDistortionExampleHistory((prev) => {
      const next = [
        nextInsights.distortionExample,
        ...prev.filter((item) => item !== nextInsights.distortionExample),
      ];
      return next.slice(0, 6);
    });
  }, []);

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
      {riskBanner ? (
        <div className="flex items-center justify-between gap-4 rounded-[14px] bg-[#FFE5E5] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FA5454] text-white body-12 font-semibold">
              !
            </span>
            <div className="min-w-0">
              <p className="body-14 font-medium text-[#B42323]">
                {locale === 'en' ? 'Risk signal detected' : '위험 신호 감지'}
              </p>
              <p className="body-14 truncate text-[#8F3030]">
                {riskBanner.text} · {riskBanner.timestamp}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-[8px] bg-[#FA5454] px-3 py-[6px] body-14 font-semibold text-white hover:cursor-pointer"
            onClick={() => setRiskBanner(null)}
          >
            {locale === 'en' ? 'Confirm' : '확인'}
          </button>
        </div>
      ) : null}
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
          <SessionInsightsPanel
            insights={analysisInsights ?? data.insights}
            isRecording={Boolean(analysisInsights)}
            recentEmotionHistory={recentEmotionHistory}
            keyConcernHistory={keyConcernHistory}
            distortionExampleHistory={distortionExampleHistory}
          />
          <SessionAutoRecordPanel
            sessionId={sessionId}
            autoRecord={data.autoRecord}
            baseInsights={data.insights}
            onRecorderStateChange={setRecorderState}
            onRiskSignalDetected={handleRiskSignalDetected}
            onAnalysisChange={handleAnalysisChange}
          />
        </div>
      )}
    </section>
  );
}
