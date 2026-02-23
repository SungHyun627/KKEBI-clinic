'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { getSessionSummaryData } from '@/features/summary/api/getSessionSummaryData';
import { submitSessionSummary } from '@/features/summary/api/submitSessionSummary';
import {
  downloadSessionRecordingFile,
  downloadSessionTranscriptTxt,
} from '@/features/summary/lib/downloads';
import { formatSummaryDate } from '@/features/summary/lib/formatSummaryDate';
import { getSummaryMissions } from '@/features/summary/lib/summaryMissions';
import { toast } from '@/shared/ui/toast';
import type {
  FollowUpSessionTiming,
  RiskEvaluation,
  SummarySubmitFormValues,
  SummaryPayload,
} from '@/features/summary/types/summary';

interface UseSessionSummaryPageProps {
  locale: string;
  sessionId: string;
}

export function useSessionSummaryPage({ locale, sessionId }: UseSessionSummaryPageProps) {
  const router = useRouter();
  const tCommon = useTranslations('common');

  const [payload, setPayload] = useState<SummaryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summaryTextOverride, setSummaryTextOverride] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setValue, control } = useForm<SummarySubmitFormValues>({
    mode: 'onChange',
    defaultValues: {
      riskEvaluation: '',
      followUpSessionTiming: '',
      additionalMemo: '',
      selectedMissionIds: [],
      nextDate: '',
      nextStartTime: '',
      nextEndTime: '',
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

  const transcriptItems = useMemo(
    () => payload?.runtime?.transcriptItems ?? [],
    [payload?.runtime?.transcriptItems],
  );
  const durationMinutesText = `${Math.floor((payload?.recorderState?.elapsedSeconds ?? 0) / 60)}분`;
  const endedAt = formatSummaryDate(payload?.endedAt);
  const clientName = payload?.sessionData?.clientName ?? tCommon('defaultUserName');
  const profileSuffix = tCommon('profileSuffix');
  const sessionType = payload?.sessionData?.sessionType;
  const riskType = payload?.sessionData?.riskType;
  const hasRecording = false;
  const emotions = payload?.summarySnapshot?.recentEmotionHistory ?? [];
  const distortions = payload?.summarySnapshot?.recentCognitiveDistortions ?? [];

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
  const riskEvaluation = useWatch({ control, name: 'riskEvaluation' });
  const followUpSessionTiming = useWatch({ control, name: 'followUpSessionTiming' });
  const additionalMemo = useWatch({ control, name: 'additionalMemo' });
  const selectedMissionIds = useWatch({ control, name: 'selectedMissionIds' });
  const nextDate = useWatch({ control, name: 'nextDate' });
  const nextStartTime = useWatch({ control, name: 'nextStartTime' });
  const nextEndTime = useWatch({ control, name: 'nextEndTime' });

  const isNextSessionAllSelected =
    Boolean(nextDate) && Boolean(nextStartTime) && Boolean(nextEndTime);
  const isNextSessionAllEmpty = !nextDate && !nextStartTime && !nextEndTime;
  const isNextSessionSelectionValid = isNextSessionAllSelected || isNextSessionAllEmpty;
  const isSubmitEnabled =
    Boolean(riskEvaluation) &&
    Boolean(followUpSessionTiming) &&
    selectedMissionIds.length > 0 &&
    isNextSessionSelectionValid &&
    !isSubmitting;

  const bookmarkedMoments = useMemo(() => {
    const bookmarkedIds = new Set(payload?.runtime?.bookmarkIds ?? []);
    return transcriptItems.filter((item) => item.id && bookmarkedIds.has(item.id));
  }, [payload?.runtime?.bookmarkIds, transcriptItems]);

  const missions = useMemo(() => getSummaryMissions(locale), [locale]);

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

  const handleToggleMission = (id: string, checked: boolean) => {
    const next = checked
      ? [...selectedMissionIds, id]
      : selectedMissionIds.filter((missionId) => missionId !== id);
    setValue('selectedMissionIds', next, { shouldDirty: true, shouldValidate: true });
  };

  const handleSubmitSummary = async () => {
    if (!riskEvaluation || !followUpSessionTiming) return;

    setIsSubmitting(true);
    const result = await submitSessionSummary(sessionId, {
      summaryText,
      riskEvaluation,
      followUpSessionTiming,
      selectedMissionIds,
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

  return {
    loading,
    error,
    isPlaying,
    setIsPlaying,
    summaryText,
    handleSummaryChange,
    transcriptItems,
    durationMinutesText,
    endedAt,
    clientName,
    profileSuffix,
    sessionType,
    riskType,
    hasRecording,
    emotions,
    distortions,
    bookmarkedMoments,
    missions,
    riskEvaluation,
    followUpSessionTiming,
    additionalMemo,
    selectedMissionIds,
    nextDate,
    nextStartTime,
    nextEndTime,
    isSubmitEnabled,
    setRiskEvaluation: (value: RiskEvaluation) =>
      setValue('riskEvaluation', value, { shouldDirty: true, shouldValidate: true }),
    setFollowUpSessionTiming: (value: FollowUpSessionTiming) =>
      setValue('followUpSessionTiming', value, { shouldDirty: true, shouldValidate: true }),
    setAdditionalMemo: (value: string) =>
      setValue('additionalMemo', value, { shouldDirty: true, shouldValidate: true }),
    setNextDate: (value: string) =>
      setValue('nextDate', value, { shouldDirty: true, shouldValidate: true }),
    setNextStartTime: (value: string) =>
      setValue('nextStartTime', value, { shouldDirty: true, shouldValidate: true }),
    setNextEndTime: (value: string) =>
      setValue('nextEndTime', value, { shouldDirty: true, shouldValidate: true }),
    handleToggleMission,
    handleDownloadTxt,
    handleDownloadAudio,
    handleSubmitSummary,
    payloadExists: Boolean(payload),
  };
}
