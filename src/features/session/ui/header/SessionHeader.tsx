'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { LocaleSwitchButton } from '@/shared/ui/locale-switch-button';
import { getSessionStartContext } from '@/shared/lib/session-start-context';
import type { SessionStartContextValue } from '@/shared/lib/session-start-context';
import SessionTypeChip from '@/features/dashboard/today-schedule/ui/SessionTypeChip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import { isRiskType, isSessionType } from '../../types/session';
import type { SessionBasicInfo } from '../../types/session';
import SessionEndConfirmDialog from './SessionEndConfirmDialog';
import type { SessionEmotionType, SessionInsightsData } from '../../types/session';
import {
  getSessionAutoRecordStorageKey,
  getSessionSummaryStorageKey,
} from '../../lib/session-storage';

interface SessionHeaderProps {
  sessionId: string;
  sessionData?: Pick<SessionBasicInfo, 'clientName' | 'sessionType' | 'riskType'>;
  recorderState?: {
    isRecording: boolean;
    isPaused: boolean;
    elapsedSeconds: number;
    visibleAudioLevel: number;
  };
  summarySnapshot?: {
    insights: SessionInsightsData;
    recentEmotionHistory: SessionEmotionType[];
    keyConcernHistory: string[];
    distortionExampleHistory: string[];
  };
  onBeforeOpenEndDialog?: () => Promise<void> | void;
}

function formatElapsed(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function SessionHeader({
  sessionId,
  sessionData,
  recorderState,
  summarySnapshot,
  onBeforeOpenEndDialog,
}: SessionHeaderProps) {
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [context, setContext] = useState<SessionStartContextValue | null>(null);
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);

  useEffect(() => {
    setContext(getSessionStartContext(sessionId));
  }, [sessionId]);

  const clientName = sessionData?.clientName ?? context?.name?.trim() ?? tCommon('defaultUserName');
  const sessionType = sessionData?.sessionType ?? context?.sessionType;
  const riskType = sessionData?.riskType ?? context?.riskType;
  const isRecording = recorderState?.isRecording ?? false;
  const isPaused = recorderState?.isPaused ?? false;
  const elapsedSeconds = recorderState?.elapsedSeconds ?? 0;
  const visibleAudioLevel = recorderState?.visibleAudioLevel ?? 0;
  const totalSessionTime = formatElapsed(elapsedSeconds > 0 ? elapsedSeconds : 10 * 60);
  const handleBackWithLocale = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(`kkebi:session-auto-record:${sessionId}`);
    }

    const returnTo = searchParams.get('returnTo');
    let safeReturnTo: string | null = null;
    if (returnTo) {
      try {
        const decoded = decodeURIComponent(returnTo);
        if (decoded.startsWith(`/${locale}`) && !decoded.includes('/session/')) {
          safeReturnTo = decoded;
        }
      } catch {
        safeReturnTo = null;
      }
    }

    router.push(safeReturnTo ?? `/${locale}/sessions`);
  };

  const handleEndSession = () => {
    if (typeof window !== 'undefined') {
      const runtimeKey = getSessionAutoRecordStorageKey(sessionId);
      const summaryKey = getSessionSummaryStorageKey(sessionId);
      const runtimeRaw = window.sessionStorage.getItem(runtimeKey);
      const runtime = runtimeRaw ? JSON.parse(runtimeRaw) : null;

      window.sessionStorage.setItem(
        summaryKey,
        JSON.stringify({
          sessionId,
          endedAt: new Date().toISOString(),
          sessionData: sessionData ?? null,
          recorderState: recorderState ?? null,
          summarySnapshot: summarySnapshot ?? null,
          runtime,
        }),
      );
      window.sessionStorage.removeItem(runtimeKey);
    }

    setIsEndDialogOpen(false);
    router.push(`/${locale}/session/${sessionId}/summary`);
  };

  return (
    <div className="flex w-full justify-between p-5">
      <div className="flex items-center gap-13">
        <div className="flex items-center gap-4">
          <span className="body-18 font-semibold text-label-normal">
            {clientName}
            {tCommon('profileSuffix')}
          </span>
          <div className="flex items-center gap-2">
            {sessionType && isSessionType(sessionType) ? (
              <SessionTypeChip value={sessionType} />
            ) : null}
            {riskType && isRiskType(riskType) ? <RiskTypeChip value={riskType} /> : null}
          </div>
        </div>
        {isRecording ? (
          <div className="flex items-center gap-8">
            <span className="body-16 font-semibold text-label-normal">
              {formatElapsed(elapsedSeconds)}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-3 w-3 rounded-full ${
                  isRecording && !isPaused ? 'bg-[#FA5454]' : 'bg-neutral-95'
                }`}
                aria-hidden
              />
              <span className="body-16 font-semibold text-label-normal">
                {isPaused
                  ? locale === 'en'
                    ? 'Paused'
                    : '일시정지'
                  : locale === 'en'
                    ? 'Recording'
                    : '녹음 중'}
              </span>
            </div>

            <div className="flex items-center">
              <Image src="/icons/speaker-2.svg" alt="" width={28} height={28} aria-hidden />
              <div className="flex h-[26px] items-center gap-[2px]">
                {[14, 28, 42, 56, 70, 84, 100].map((threshold) => (
                  <span
                    key={threshold}
                    className={`h-6 w-[6px] rounded-[2px] ${
                      visibleAudioLevel >= threshold ? 'bg-label-alternative' : 'bg-label-disable'
                    }`}
                    aria-hidden
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex gap-3">
        <div className="flex items-center gap-[19px] max-w-[135px] w-full">
          <Button
            onClick={async () => {
              await onBeforeOpenEndDialog?.();
              setIsEndDialogOpen(true);
            }}
            className="h-[38px] w-[92px] rounded-[8px]"
          >
            {locale === 'en' ? 'End' : '상담 종료'}
          </Button>
          <Button
            variant="icon"
            onClick={handleBackWithLocale}
            className="p-0 border-none hover:bg-white h-6 w-6"
          >
            <Image src="/icons/backward.svg" alt="" width={24} height={24} />
          </Button>
        </div>
        <LocaleSwitchButton />
      </div>

      <SessionEndConfirmDialog
        open={isEndDialogOpen}
        totalSessionTime={totalSessionTime}
        onOpenChange={setIsEndDialogOpen}
        onConfirm={handleEndSession}
      />
    </div>
  );
}
