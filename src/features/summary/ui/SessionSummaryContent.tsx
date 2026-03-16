'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import AiSummaryCard from './components/AiSummaryCard';
import CompletionCard from './components/CompletionCard';
import SummaryTopBar from './components/SummaryTopBar';
import EmotionPatternsCard from './components/EmotionPatternsCard';
import DetectedCognitiveDistortionCard from './components/DetectedCognitiveDistortionCard';
import BookmarkedMomentsCard from './components/BookmarkedMomentsCard';
import { useSessionSummary } from '../hooks/useSessionSummary';

interface SessionSummaryContentProps {
  locale: string;
  sessionId: number;
  backLabel: string;
}

const CounselorEvaluationCard = dynamic(() => import('./components/CounselorEvaluationCard'));
const RecommendedMissionsCard = dynamic(() => import('./components/RecommendedMissionsCard'));
const NextSessionBookingCard = dynamic(() => import('./components/NextSessionBookingCard'));

export default function SessionSummaryContent({
  locale,
  sessionId,
  backLabel,
}: SessionSummaryContentProps) {
  const router = useRouter();
  const tSummary = useTranslations('summary');
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
    additionalMemo,
    selectedMissionIds,
    nextDate,
    nextStartTime,
    nextEndTime,
    setRiskEvaluation,
    setFollowUpSessionTiming,
    setAdditionalMemo,
    setNextDate,
    setNextStartTime,
    setNextEndTime,
    handleToggleMission,
    handleDownloadTxt,
    handleDownloadPdf,
    handleDownloadAudio,
    handleSubmitSummary,
    audioRef,
    recordingAudioUrl,
    isSubmitted,
    isSubmitEnabled,
    payloadExists,
  } = useSessionSummary({ locale, sessionId });

  if (loading) {
    return (
      <section className="flex min-h-[320px] items-center justify-center body-14 text-label-alternative">
        {tSummary('loading')}
      </section>
    );
  }

  const hasLoadError = Boolean(error) || !payloadExists;

  return (
    <section className="flex w-full flex-col gap-[62px] pb-5">
      <audio ref={audioRef} src={recordingAudioUrl || undefined} preload="metadata" />
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
        onPrintPdf={handleDownloadPdf}
        onBack={() => router.push(`/${locale}`)}
        confirmOnBack={!isSubmitted}
      />

      <div className="flex flex-col gap-[53px] items-start w-full px-15">
        {hasLoadError ? (
          <div className="w-full rounded-[10px] border border-status-negative/20 bg-status-negative/5 px-4 py-3 body-14 text-black">
            {tSummary('loadFailed')}
          </div>
        ) : null}
        <CompletionCard
          duration={durationMinutesText}
          endedAt={endedAt}
          hasRecording={hasRecording}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
        />
        <div className="flex flex-col gap-[100px] items-start w-full">
          <div className="flex flex-col gap-[70px] items-start w-full">
            <AiSummaryCard
              value={summaryText}
              onChange={handleSummaryChange}
              isReadOnly={isSubmitted}
            />

            <EmotionPatternsCard emotions={emotions} />
            <DetectedCognitiveDistortionCard distortions={distortions} />
            <BookmarkedMomentsCard locale={locale} moments={bookmarkedMoments} />

            {isSubmitted ? null : (
              <>
                <CounselorEvaluationCard
                  riskEvaluation={riskEvaluation}
                  followUpSessionTiming={followUpSessionTiming}
                  additionalMemo={additionalMemo}
                  onRiskEvaluationChange={setRiskEvaluation}
                  onFollowUpSessionTimingChange={setFollowUpSessionTiming}
                  onAdditionalMemoChange={setAdditionalMemo}
                />

                <RecommendedMissionsCard
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
              </>
            )}
          </div>
          {isSubmitted ? null : (
            <div className="flex justify-center items-center w-full">
              <Button
                type="button"
                className="w-full max-w-[416px]"
                disabled={hasLoadError || !isSubmitEnabled}
                onClick={handleSubmitSummary}
              >
                {tSummary('submitButton')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
