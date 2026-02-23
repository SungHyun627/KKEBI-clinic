'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { printSessionSummaryPdf } from '@/features/summary/lib/downloads';
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
import { useSessionSummaryPage } from '../hooks/useSessionSummaryPage';

interface SessionSummaryContentProps {
  locale: string;
  sessionId: string;
  backLabel: string;
}

export default function SessionSummaryContent({
  locale,
  sessionId,
  backLabel,
}: SessionSummaryContentProps) {
  const router = useRouter();
  const {
    loading,
    error,
    isPlaying,
    setIsPlaying,
    summaryText,
    handleSummaryChange,
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
    selectedMissionIds,
    nextDate,
    nextStartTime,
    nextEndTime,
    isSubmitEnabled,
    setRiskEvaluation,
    setFollowUpSessionTiming,
    setNextDate,
    setNextStartTime,
    setNextEndTime,
    handleToggleMission,
    handleDownloadTxt,
    handleDownloadAudio,
    handleSubmitSummary,
    payloadExists,
  } = useSessionSummaryPage({ locale, sessionId });

  if (loading) {
    return (
      <section className="flex min-h-[320px] items-center justify-center body-14 text-label-alternative">
        {locale === 'en' ? 'Loading summary data...' : '요약 데이터를 불러오는 중입니다...'}
      </section>
    );
  }

  if (error || !payloadExists) {
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
        profileSuffix={profileSuffix}
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

            <EmotionPatternsCard locale={locale} emotions={emotions} />
            <DetectedCognitiveDistortionCard locale={locale} distortions={distortions} />
            <BookmarkedMomentsCard locale={locale} moments={bookmarkedMoments} />

            <CounselorEvaluationCard
              locale={locale}
              riskEvaluation={riskEvaluation}
              followUpSessionTiming={followUpSessionTiming}
              onRiskEvaluationChange={setRiskEvaluation}
              onFollowUpSessionTimingChange={setFollowUpSessionTiming}
            />

            <RecommendedMissionsCard
              locale={locale}
              missions={missions}
              selectedMissions={selectedMissionIds}
              onToggleMission={handleToggleMission}
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
