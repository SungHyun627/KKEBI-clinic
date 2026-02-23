'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { getSessionSummaryData } from '@/features/summary/api/getSessionSummaryData';
import { submitSessionSummary } from '@/features/summary/api/submitSessionSummary';
import {
  downloadSessionRecordingFile,
  downloadSessionTranscriptTxt,
  printSessionSummaryPdf,
} from '@/features/summary/lib/downloads';
import { toast } from '@/shared/ui/toast';
import type {
  FollowUpSessionTiming,
  MissionItem,
  RiskEvaluation,
  SummaryPayload,
} from '@/features/summary/types/summary';
import {
  AiSummaryCard,
  CompletionCard,
  CounselorEvaluationCard,
  NextSessionBookingCard,
  RecommendedMissionsCard,
  SummaryTopBar,
  EmotionPatternsCard,
  DetectedCognitiveDistortionCard,
  BookmarkedMomentsCard,
} from './components';

interface SessionSummaryContentProps {
  locale: string;
  sessionId: string;
  backLabel: string;
}

interface SummarySubmitFormValues {
  riskEvaluation: RiskEvaluation | '';
  followUpSessionTiming: FollowUpSessionTiming | '';
}

function formatSummaryDate(iso?: string) {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}. ${mm}. ${dd}`;
}

export default function SessionSummaryContent({
  locale,
  sessionId,
  backLabel,
}: SessionSummaryContentProps) {
  const router = useRouter();
  const tCommon = useTranslations('common');

  const [payload, setPayload] = useState<SummaryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summaryTextOverride, setSummaryTextOverride] = useState('');
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);
  const [nextDate, setNextDate] = useState('');
  const [nextStartTime, setNextStartTime] = useState('');
  const [nextEndTime, setNextEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setValue, watch } = useForm<SummarySubmitFormValues>({
    mode: 'onChange',
    defaultValues: {
      riskEvaluation: '',
      followUpSessionTiming: '',
    },
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const result = await getSessionSummaryData(sessionId, locale);
      if (cancelled) return;

      if (!result.success || !result.data) {
        setPayload(null);
        setError(result.message || 'Failed to load session summary data.');
        setLoading(false);
        return;
      }

      setPayload(result.data);
      setError(null);
      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [locale, sessionId]);

  const transcriptItems = payload?.runtime?.transcriptItems ?? [];
  const durationMinutesText = `${Math.floor((payload?.recorderState?.elapsedSeconds ?? 0) / 60)}분`;
  const endedAt = formatSummaryDate(payload?.endedAt);
  const clientName = payload?.sessionData?.clientName ?? tCommon('defaultUserName');
  const sessionType = payload?.sessionData?.sessionType;
  const riskType = payload?.sessionData?.riskType;
  const hasRecording = false;

  const derivedSummaryText = useMemo(() => {
    const clientTurns = transcriptItems.filter((item) => item.speaker === 'client');
    const latestClientText = clientTurns.at(-1)?.text ?? '';

    return locale === 'en'
      ? `Client reported ${clientTurns.length} key statements. Main topics include ${
          (payload?.summarySnapshot?.insights?.keyConcerns ?? []).join(', ') || 'daily stress'
        }. Latest concern: ${latestClientText || 'N/A'}.`
      : `내담자 발화 ${clientTurns.length}건을 기반으로, 주요 주제는 ${
          (payload?.summarySnapshot?.insights?.keyConcerns ?? []).join(', ') || '일상 스트레스'
        }입니다. 최근 진술: ${latestClientText || '없음'}.`;
  }, [locale, payload?.summarySnapshot?.insights?.keyConcerns, transcriptItems]);

  const summaryText = summaryTextOverride || derivedSummaryText;
  const riskEvaluation = watch('riskEvaluation');
  const followUpSessionTiming = watch('followUpSessionTiming');
  const isNextSessionAllSelected =
    Boolean(nextDate) && Boolean(nextStartTime) && Boolean(nextEndTime);
  const isNextSessionAllEmpty = !nextDate && !nextStartTime && !nextEndTime;
  const isNextSessionSelectionValid = isNextSessionAllSelected || isNextSessionAllEmpty;
  const isSubmitEnabled =
    Boolean(riskEvaluation) &&
    Boolean(followUpSessionTiming) &&
    selectedMissions.length > 0 &&
    isNextSessionSelectionValid &&
    !isSubmitting;

  const bookmarkedMoments = useMemo(() => {
    const bookmarkedIds = new Set(payload?.runtime?.bookmarkIds ?? []);
    return transcriptItems.filter((item) => item.id && bookmarkedIds.has(item.id));
  }, [payload?.runtime?.bookmarkIds, transcriptItems]);

  const missions: MissionItem[] = [
    {
      id: 'breathing',
      name: locale === 'en' ? 'Breathing log' : '호흡 훈련 일지',
      category: locale === 'en' ? 'Breathing' : '호흡',
      duration: locale === 'en' ? '10 min' : '10분',
    },
    {
      id: 'sleep',
      name: locale === 'en' ? 'Sleep routine check' : '수면 루틴 체크',
      category: locale === 'en' ? 'Sleep' : '수면',
      duration: locale === 'en' ? '15 min' : '15분',
    },
    {
      id: 'walk',
      name: locale === 'en' ? 'Morning walk' : '아침 산책',
      category: locale === 'en' ? 'Activity' : '활동',
      duration: locale === 'en' ? '20 min' : '20분',
    },
    {
      id: 'thought',
      name: locale === 'en' ? 'Thought record' : '사고기록지 작성',
      category: locale === 'en' ? 'CBT' : '인지기록',
      duration: locale === 'en' ? '15 min' : '15분',
    },
    {
      id: 'gratitude',
      name: locale === 'en' ? 'Gratitude note' : '감사일기',
      category: locale === 'en' ? 'Journaling' : '저널링',
      duration: locale === 'en' ? '10 min' : '10분',
    },
    {
      id: 'stretch',
      name: locale === 'en' ? 'Night stretching' : '취침 전 스트레칭',
      category: locale === 'en' ? 'Body care' : '신체관리',
      duration: locale === 'en' ? '8 min' : '8분',
    },
  ];

  const handleSummaryChange = (value: string) => {
    const trimmed = value.trim();
    const defaultTrimmed = derivedSummaryText.trim();
    setSummaryTextOverride(trimmed === defaultTrimmed ? '' : value);
  };

  const handleDownloadTxt = () => {
    downloadSessionTranscriptTxt({
      sessionId,
      transcriptItems,
      locale,
    });
  };

  const handleDownloadAudio = () => {
    downloadSessionRecordingFile({
      sessionId,
      transcriptItems,
      locale,
    });
  };

  const handleSubmitSummary = async () => {
    if (!riskEvaluation || !followUpSessionTiming) return;

    setIsSubmitting(true);
    const result = await submitSessionSummary(sessionId, {
      summaryText,
      riskEvaluation,
      followUpSessionTiming,
      selectedMissionIds: selectedMissions,
      nextSession:
        nextDate && nextStartTime && nextEndTime
          ? {
              date: nextDate,
              startTime: nextStartTime,
              endTime: nextEndTime,
            }
          : null,
    });

    if (!result.success) {
      toast(
        result.message || (locale === 'en' ? 'Failed to submit summary.' : '제출에 실패했습니다.'),
      );
      setIsSubmitting(false);
      return;
    }

    window.sessionStorage.setItem('kkebi:summarySubmitted', '1');
    router.push(`/${locale}`);
  };

  if (loading) {
    return (
      <section className="flex min-h-[320px] items-center justify-center body-14 text-label-alternative">
        {locale === 'en' ? 'Loading summary data...' : '요약 데이터를 불러오는 중입니다...'}
      </section>
    );
  }

  if (error || !payload) {
    return (
      <section className="flex min-h-[320px] items-center justify-center body-14 text-status-negative">
        {error ??
          (locale === 'en' ? 'Failed to load summary data.' : '요약 데이터를 불러오지 못했습니다.')}
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col gap-[62px] pb-5">
      <SummaryTopBar
        locale={locale}
        backLabel={backLabel}
        clientName={clientName}
        profileSuffix={tCommon('profileSuffix')}
        sessionType={sessionType}
        riskType={riskType}
        hasRecording={hasRecording}
        onDownloadTxt={handleDownloadTxt}
        onDownloadAudio={handleDownloadAudio}
        onPrintPdf={printSessionSummaryPdf}
        onBack={() => router.push(`/${locale}`)}
      />

      <div className="flex flex-col gap-[53px] items-start w-full px-15">
        <CompletionCard
          locale={locale}
          duration={durationMinutesText}
          endedAt={endedAt}
          hasRecording={hasRecording}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
        />
        <div className="flex flex-col gap-[100px] items-start w-full">
          <div className="flex flex-col gap-[70px] items-start w-full">
            <AiSummaryCard locale={locale} value={summaryText} onChange={handleSummaryChange} />

            <EmotionPatternsCard
              locale={locale}
              emotions={payload?.summarySnapshot?.recentEmotionHistory ?? []}
            />
            <DetectedCognitiveDistortionCard
              locale={locale}
              distortions={payload?.summarySnapshot?.recentCognitiveDistortions ?? []}
            />
            <BookmarkedMomentsCard locale={locale} moments={bookmarkedMoments} />

            <CounselorEvaluationCard
              locale={locale}
              riskEvaluation={riskEvaluation}
              followUpSessionTiming={followUpSessionTiming}
              onRiskEvaluationChange={(value) =>
                setValue('riskEvaluation', value, { shouldDirty: true, shouldValidate: true })
              }
              onFollowUpSessionTimingChange={(value) =>
                setValue('followUpSessionTiming', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />

            <RecommendedMissionsCard
              locale={locale}
              missions={missions}
              selectedMissions={selectedMissions}
              onToggleMission={(id, checked) => {
                setSelectedMissions((prev) =>
                  checked ? [...prev, id] : prev.filter((missionId) => missionId !== id),
                );
              }}
            />

            <NextSessionBookingCard
              locale={locale}
              nextDate={nextDate}
              nextStartTime={nextStartTime}
              nextEndTime={nextEndTime}
              onNextDateChange={setNextDate}
              onNextStartTimeChange={setNextStartTime}
              onNextEndTimeChange={setNextEndTime}
            />
          </div>
          <div className="flex justify-center items-center w-full">
            <Button
              type="button"
              className="w-full max-w-[416px]"
              disabled={!isSubmitEnabled}
              onClick={handleSubmitSummary}
            >
              {locale === 'en' ? 'Save record and complete' : '기록 저장 및 완료'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
