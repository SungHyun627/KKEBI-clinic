'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { getSessionPageMock } from '@/shared/mock/session-page';
import SessionHeader from '../header/SessionHeader';
import SessionInsightsPanel from '../insights/SessionInsightsPanel';
import SessionAutoRecordPanel from '../auto-record/SessionAutoRecordPanel';
import type { SessionEmotionType, SessionInsightsData } from '../../types/session';
import { isRiskType, isSessionType } from '../../types/session';
import { useSessionInfo } from '../../hooks/useSessionInfo';

interface SessionPageContentProps {
  sessionId: string;
}

export default function SessionPageContent({ sessionId }: SessionPageContentProps) {
  const locale = useLocale();
  const { data, loading, error } = useSessionInfo({ sessionId });
  const pageMock = useMemo(() => getSessionPageMock(sessionId, locale), [locale, sessionId]);
  const [recorderState, setRecorderState] = useState({
    isRecording: false,
    isPaused: false,
    elapsedSeconds: 0,
    visibleAudioLevel: 0,
  });
  const [riskBanner, setRiskBanner] = useState<{ text: string; timestamp: string } | null>(null);
  const [analysisInsights, setAnalysisInsights] = useState<SessionInsightsData | null>(null);
  const [recentEmotionHistory, setRecentEmotionHistory] = useState<SessionEmotionType[]>([]);
  const [keyConcernHistory, setKeyConcernHistory] = useState<string[]>([]);
  const [distortionExampleHistory, setDistortionExampleHistory] = useState<string[]>([]);
  const prepareEndSessionRef = useRef<(() => void) | null>(null);
  const uploadFullAudioRef = useRef<(() => Promise<boolean>) | null>(null);

  const handleRiskSignalDetected = useCallback((payload: { text: string; timestamp: string }) => {
    setRiskBanner(payload);
  }, []);

  const handleAnalysisChange = useCallback((nextInsights: SessionInsightsData | null) => {
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

  const handleRegisterPrepareEndSession = useCallback((handler: () => void) => {
    prepareEndSessionRef.current = handler;
  }, []);
  const handleRegisterUploadFullAudio = useCallback((handler: () => Promise<boolean>) => {
    uploadFullAudioRef.current = handler;
  }, []);

  const handleBeforeOpenEndDialog = useCallback(async () => {
    prepareEndSessionRef.current?.();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }, []);
  const handleBeforeEndSession = useCallback(async () => {
    return (await uploadFullAudioRef.current?.()) ?? true;
  }, []);

  return (
    <section className="flex min-h-[calc(100dvh)] w-full flex-col gap-5 bg-white">
      <SessionHeader
        sessionId={sessionId}
        sessionData={
          data && isSessionType(data.sessionType) && isRiskType(data.riskType)
            ? {
                clientName: data.clientName,
                sessionType: data.sessionType,
                riskType: data.riskType,
              }
            : undefined
        }
        recorderState={recorderState}
        summarySnapshot={
          data
            ? {
                insights: analysisInsights ?? pageMock.insights,
                recentEmotionHistory,
                keyConcernHistory,
                distortionExampleHistory,
              }
            : undefined
        }
        onBeforeOpenEndDialog={handleBeforeOpenEndDialog}
        onBeforeEndSession={handleBeforeEndSession}
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
            insights={analysisInsights ?? pageMock.insights}
            isRecording={Boolean(analysisInsights)}
            recentEmotionHistory={recentEmotionHistory}
            keyConcernHistory={keyConcernHistory}
            distortionExampleHistory={distortionExampleHistory}
          />
          <SessionAutoRecordPanel
            sessionId={sessionId}
            autoRecord={pageMock.autoRecord}
            baseInsights={pageMock.insights}
            onRecorderStateChange={setRecorderState}
            onRiskSignalDetected={handleRiskSignalDetected}
            onAnalysisChange={handleAnalysisChange}
            onRegisterPrepareEndSession={handleRegisterPrepareEndSession}
            onRegisterUploadFullAudio={handleRegisterUploadFullAudio}
          />
        </div>
      )}
    </section>
  );
}
