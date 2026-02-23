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
import { toast } from '@/shared/ui/toast';
import type {
  FollowUpSessionTiming,
  MissionItem,
  RiskEvaluation,
  SummaryPayload,
} from '@/features/summary/types/summary';

interface UseSessionSummaryPageProps {
  locale: string;
  sessionId: string;
}

interface SummarySubmitFormValues {
  riskEvaluation: RiskEvaluation | '';
  followUpSessionTiming: FollowUpSessionTiming | '';
  selectedMissionIds: string[];
  nextDate: string;
  nextStartTime: string;
  nextEndTime: string;
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
  const riskEvaluation = useWatch({ control, name: 'riskEvaluation' });
  const followUpSessionTiming = useWatch({ control, name: 'followUpSessionTiming' });
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
    sessionType,
    riskType,
    hasRecording,
    bookmarkedMoments,
    missions,
    riskEvaluation,
    followUpSessionTiming,
    selectedMissionIds,
    nextDate,
    nextStartTime,
    nextEndTime,
    isSubmitEnabled,
    setRiskEvaluation: (value: RiskEvaluation) =>
      setValue('riskEvaluation', value, { shouldDirty: true, shouldValidate: true }),
    setFollowUpSessionTiming: (value: FollowUpSessionTiming) =>
      setValue('followUpSessionTiming', value, { shouldDirty: true, shouldValidate: true }),
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
