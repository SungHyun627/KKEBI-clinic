'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { getSessionSummary } from '@/features/summary/api/getSessionSummary';
import { submitSessionSummary } from '@/features/summary/api/submitSessionSummary';
import { downloadSessionReport } from '@/features/summary/api/downloadSessionReport';
import { downloadSessionRecordingFile } from '@/features/summary/lib/downloads';
import { formatSummaryDate } from '@/features/summary/lib/formatSummaryDate';
import { toast } from '@/shared/ui/toast';
import { getSessionAudioPreviewUrl } from '@/shared/lib/session-audio-preview-cache';
import type {
  FollowUpSessionTiming,
  MissionItem,
  RiskEvaluation,
  SummarySubmitFormValues,
  SummaryPayload,
} from '@/features/summary/types/summary';

interface UseSessionSummaryProps {
  locale: string;
  sessionId: number;
}

export function useSessionSummary({ locale, sessionId }: UseSessionSummaryProps) {
  const router = useRouter();
  const tCommon = useTranslations('common');
  const tSummary = useTranslations('summary');

  const [payload, setPayload] = useState<SummaryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summaryTextOverride, setSummaryTextOverride] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      const result = await getSessionSummary(sessionId);
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

  const normalizeSpeaker = (value?: string) => {
    if (value === 'counselor' || value === 'COUNSELOR') return 'counselor' as const;
    if (value === 'client' || value === 'CLIENT') return 'client' as const;
    return 'client' as const;
  };

  const normalizeTimestamp = (value?: string) => {
    if (!value) return '--:--:--';
    if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
    if (/^\d{2}:\d{2}$/.test(value)) return `00:${value}`;

    if (value.includes('T')) {
      const [, timePart = ''] = value.split('T');
      const hms = timePart.slice(0, 8);
      if (/^\d{2}:\d{2}:\d{2}$/.test(hms)) return hms;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    const hh = String(parsed.getHours()).padStart(2, '0');
    const mm = String(parsed.getMinutes()).padStart(2, '0');
    const ss = String(parsed.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const transcriptItems = useMemo(() => {
    const source = payload?.summarySnapshot?.transcript ?? [];
    return source.map((item, index) => ({
      ...item,
      id: item.id ?? index + 1,
      speaker: normalizeSpeaker(item.speaker),
      timestamp: normalizeTimestamp(item.timestamp),
    }));
  }, [payload?.summarySnapshot?.transcript]);
  const durationMinutesText = `${Math.floor((payload?.recorderState?.elapsedSeconds ?? 0) / 60)}${tSummary(
    'durationMinuteUnit',
  )}`;
  const endedAt = formatSummaryDate(payload?.endedAt);
  const clientName = payload?.sessionData?.clientName ?? tCommon('defaultUserName');
  const profileSuffix = tCommon('profileSuffix');
  const sessionType = payload?.sessionData?.sessionType;
  const riskType = payload?.sessionData?.riskType;
  const recordingPreviewUrl = getSessionAudioPreviewUrl(String(sessionId));
  const recordingAudioUrl = payload?.audioUrl || recordingPreviewUrl || '';
  const hasRecording = Boolean(recordingAudioUrl);
  const effectiveIsPlaying = hasRecording && isPlaying;
  const emotions = payload?.summarySnapshot?.emotionPatterns ?? [];
  const distortions = payload?.summarySnapshot?.detectedDistortions ?? [];

  const summaryTextFromResponse = payload?.summarySnapshot?.summaryText ?? '';
  const summaryText = summaryTextOverride || summaryTextFromResponse;
  const riskEvaluation = useWatch({ control, name: 'riskEvaluation' });
  const followUpSessionTiming = useWatch({ control, name: 'followUpSessionTiming' });
  const additionalMemo = useWatch({ control, name: 'additionalMemo' });
  const selectedMissionIds = useWatch({ control, name: 'selectedMissionIds' });
  const nextDate = useWatch({ control, name: 'nextDate' });
  const nextStartTime = useWatch({ control, name: 'nextStartTime' });
  const nextEndTime = useWatch({ control, name: 'nextEndTime' });

  const missions = useMemo<MissionItem[]>(() => {
    const recommended = payload?.summarySnapshot?.recommendedMissions ?? [];
    if (recommended.length > 0) {
      return recommended.map((mission, index) => ({
        id: String(mission.id ?? `recommended-${index + 1}`),
        name: mission.title ?? (locale === 'en' ? 'Recommended mission' : '추천 미션'),
        category: mission.description ?? '-',
        duration:
          typeof mission.duration === 'number'
            ? locale === 'en'
              ? `${mission.duration} days`
              : `${mission.duration}일`
            : '-',
      }));
    }

    return [];
  }, [locale, payload?.summarySnapshot?.recommendedMissions]);

  const hasAnyNextSessionInput =
    Boolean(nextDate) || Boolean(nextStartTime) || Boolean(nextEndTime);
  const isNextSessionAllEmpty = !hasAnyNextSessionInput;
  const isNextSessionSelectionValid =
    isNextSessionAllEmpty || (Boolean(nextDate) && Boolean(nextStartTime));
  const isMissionSelectionValid = missions.length === 0 || selectedMissionIds.length > 0;
  const canSubmitSummary = !error && Boolean(payload);
  const isSubmitEnabled =
    canSubmitSummary &&
    Boolean(riskEvaluation) &&
    Boolean(followUpSessionTiming) &&
    isMissionSelectionValid &&
    isNextSessionSelectionValid &&
    !isSubmitting;

  const bookmarkedMoments = useMemo(() => {
    const bookmarks = payload?.summarySnapshot?.bookmarks ?? [];
    if (bookmarks.length === 0) return [];

    const transcriptById = new Map(transcriptItems.map((item) => [item.id, item]));
    return bookmarks.map((bookmark, index) => {
      const matched = bookmark.id ? transcriptById.get(bookmark.id) : null;
      if (matched) return matched;

      const offset = bookmark.timeOffset ?? 0;
      const hh = String(Math.floor(offset / 3600)).padStart(2, '0');
      const mm = String(Math.floor((offset % 3600) / 60)).padStart(2, '0');
      const ss = String(offset % 60).padStart(2, '0');
      return {
        id: Number(`${sessionId}${index + 1}`),
        speaker: 'client' as const,
        text: bookmark.targetText ?? bookmark.memo ?? '',
        timestamp: `${hh}:${mm}:${ss}`,
      };
    });
  }, [payload?.summarySnapshot?.bookmarks, sessionId, transcriptItems]);

  const handleSummaryChange = (value: string) => {
    const trimmed = value.trim();
    const defaultTrimmed = summaryTextFromResponse.trim();
    setSummaryTextOverride(trimmed === defaultTrimmed ? '' : value);
  };

  const handleDownloadTxt = async () => {
    try {
      await downloadSessionReport(sessionId, 'txt');
    } catch {
      toast(locale === 'en' ? 'Failed to download TXT.' : 'TXT 다운로드에 실패했습니다.');
    }
  };

  const handleDownloadPdf = async () => {
    try {
      await downloadSessionReport(sessionId, 'pdf');
    } catch {
      toast(locale === 'en' ? 'Failed to download PDF.' : 'PDF 다운로드에 실패했습니다.');
    }
  };

  const handleDownloadAudio = async () => {
    try {
      await downloadSessionReport(sessionId, 'audio');
    } catch {
      // 백엔드 파일 다운로드 실패 시 기존 로컬 다운로드로 폴백
      downloadSessionRecordingFile({
        sessionId,
        transcriptItems,
        locale,
        audioUrl: recordingAudioUrl || undefined,
      });
    }
  };

  const handleToggleMission = (id: string, checked: boolean) => {
    const next = checked
      ? [...selectedMissionIds, id]
      : selectedMissionIds.filter((missionId) => missionId !== id);
    setValue('selectedMissionIds', next, { shouldDirty: true, shouldValidate: true });
  };

  const handleSubmitSummary = async () => {
    if (!canSubmitSummary || !riskEvaluation || !followUpSessionTiming) return;

    setIsSubmitting(true);
    const result = await submitSessionSummary(sessionId, {
      endedAt: payload?.endedAt ?? new Date().toISOString(),
      summaryText,
      riskEvaluation,
      followUpSessionTiming,
      additionalMemo,
      selectedMissionIds,
      nextSession:
        nextDate && nextStartTime
          ? {
              date: nextDate,
              startTime: nextStartTime,
              endTime: nextEndTime || undefined,
            }
          : null,
    });

    if (!result.success) {
      toast(result.message || tSummary('submitFailed'));
      setIsSubmitting(false);
      return;
    }

    window.sessionStorage.setItem('kkebi:summarySubmitted', '1');
    router.push(`/${locale}`);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!hasRecording) {
      return;
    }

    if (effectiveIsPlaying) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
      return;
    }

    audio.pause();
  }, [effectiveIsPlaying, hasRecording]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

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
    handleDownloadPdf,
    handleDownloadAudio,
    handleSubmitSummary,
    audioRef,
    recordingAudioUrl,
    payloadExists: Boolean(payload),
  };
}
