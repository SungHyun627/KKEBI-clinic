'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { getSessionSummaryData } from '@/features/summary/api/getSessionSummaryData';
import {
  downloadSessionRecordingFile,
  downloadSessionTranscriptTxt,
  printSessionSummaryPdf,
} from '@/features/summary/lib/downloads';
import type {
  MissionItem,
  NextSessionRecommendation,
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
  TasksTabCard,
  EmotionPatternsCard,
} from './components';

interface SessionSummaryContentProps {
  locale: string;
  sessionId: string;
  backLabel: string;
}

function formatElapsed(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
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

function getDistortionLabel(locale: string, distortionType?: string) {
  if (distortionType === 'black_and_white') return locale === 'en' ? 'Black-and-white' : '흑백논리';
  if (distortionType === 'overgeneralization')
    return locale === 'en' ? 'Overgeneralization' : '과잉일반화';
  if (distortionType === 'catastrophizing') return locale === 'en' ? 'Catastrophizing' : '파국화';
  if (distortionType === 'should_statement')
    return locale === 'en' ? 'Should statement' : '당위적 사고';
  return locale === 'en' ? 'Not detected' : '미감지';
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
  const [riskEvaluationOverride, setRiskEvaluationOverride] = useState<RiskEvaluation | null>(null);
  const [nextSessionRecommendation, setNextSessionRecommendation] =
    useState<NextSessionRecommendation>('2w');
  const [evaluationMemo, setEvaluationMemo] = useState('');
  const [summaryTextOverride, setSummaryTextOverride] = useState('');
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);
  const [coordinationLater, setCoordinationLater] = useState(false);
  const [nextDate, setNextDate] = useState('');
  const [nextTime, setNextTime] = useState('');

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

  const derivedRiskEvaluation: RiskEvaluation = (() => {
    const risk = payload?.summarySnapshot?.insights?.riskType;
    if (risk === '안정') return 'stable';
    if (risk === '위험') return 'risk';
    return 'caution';
  })();

  const riskEvaluation = riskEvaluationOverride ?? derivedRiskEvaluation;

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

  const bookmarkedMoments = useMemo(() => {
    const bookmarkedIds = new Set(payload?.runtime?.bookmarkIds ?? []);
    return transcriptItems.filter((item) => item.id && bookmarkedIds.has(item.id));
  }, [payload?.runtime?.bookmarkIds, transcriptItems]);

  const distortionLabel = getDistortionLabel(
    locale,
    payload?.summarySnapshot?.insights?.distortionType,
  );

  const missions: MissionItem[] = [
    { id: 'breathing', name: locale === 'en' ? 'Breathing log' : '호흡 훈련 일지', eta: '10m' },
    { id: 'sleep', name: locale === 'en' ? 'Sleep routine check' : '수면 루틴 체크', eta: '15m' },
    { id: 'walk', name: locale === 'en' ? 'Morning walk' : '아침 산책', eta: '20m' },
    { id: 'thought', name: locale === 'en' ? 'Thought record' : '사고기록지 작성', eta: '15m' },
    { id: 'gratitude', name: locale === 'en' ? 'Gratitude note' : '감사일기', eta: '10m' },
    { id: 'stretch', name: locale === 'en' ? 'Night stretching' : '취침 전 스트레칭', eta: '8m' },
  ];

  const assignedTasks = [
    locale === 'en' ? 'Emotion log (3x)' : '감정 기록 3회 작성',
    locale === 'en' ? 'Sleep routine check' : '수면 루틴 체크',
  ];

  const handleSummaryChange = (value: string) => {
    const trimmed = value.trim();
    const defaultTrimmed = derivedSummaryText.trim();
    setSummaryTextOverride(trimmed === defaultTrimmed ? '' : value);
  };

  const handleRiskEvaluationChange = (value: RiskEvaluation) => {
    setRiskEvaluationOverride(value === derivedRiskEvaluation ? null : value);
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
    <section className="flex w-full flex-col gap-[62px]">
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
        <div className="flex flex-col gap-[70px] items-start w-full">
          <AiSummaryCard locale={locale} value={summaryText} onChange={handleSummaryChange} />

          <EmotionPatternsCard
            locale={locale}
            emotions={payload?.summarySnapshot?.recentEmotionHistory ?? []}
            distortionLabel={distortionLabel}
            bookmarkedMoments={bookmarkedMoments}
          />

          <CounselorEvaluationCard
            locale={locale}
            riskEvaluation={riskEvaluation}
            nextSessionRecommendation={nextSessionRecommendation}
            evaluationMemo={evaluationMemo}
            onRiskChange={handleRiskEvaluationChange}
            onNextSessionChange={setNextSessionRecommendation}
            onMemoChange={setEvaluationMemo}
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
            coordinationLater={coordinationLater}
            nextDate={nextDate}
            nextTime={nextTime}
            onCoordinationLaterChange={setCoordinationLater}
            onNextDateChange={setNextDate}
            onNextTimeChange={setNextTime}
          />
        </div>

        <TasksTabCard locale={locale} assignedTasks={assignedTasks} missions={missions} />
      </div>

      <div className="mt-4 pb-8">
        <Button type="button" className="h-12 w-full rounded-[12px]">
          {locale === 'en' ? 'Save record and complete' : '기록 저장 및 완료'}
        </Button>
      </div>
    </section>
  );
}
