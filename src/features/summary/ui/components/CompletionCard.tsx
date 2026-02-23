import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';

interface CompletionCardProps {
  duration: string;
  endedAt: string;
  hasRecording: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function CompletionCard({
  duration,
  endedAt,
  hasRecording,
  isPlaying,
  onTogglePlay,
}: CompletionCardProps) {
  const tSummary = useTranslations('summary');

  return (
    <div className="flex flex-col w-full items-center gap-[33px] px-[18px] py-[26px] rounded-[24px] bg-neutral-99">
      <div className="flex flex-col items-center gap-[23px]">
        <Image src="/icons/checkmark.svg" alt={tSummary('completionAlt')} width={96} height={96} />
        <span className="text-[24px] font-semibold text-label-normal">
          {tSummary('completionTitle')}
        </span>
        <div className="flex w-fit flex-col items-start gap-2 self-center">
          <div className="flex w-full items-center gap-3">
            <span className="body-16 text-neutral-60 min-w-[70px]">
              {tSummary('completionDateLabel')}
            </span>
            <span className="body-16 font-medium text-neutral-30">{endedAt}</span>
          </div>
          <div className="flex w-full items-center gap-3">
            <span className="body-16 text-neutral-60 min-w-[70px]">
              {tSummary('completionDurationLabel')}
            </span>
            <span className="body-16 font-medium text-neutral-30">{duration}</span>
          </div>
        </div>
      </div>

      <Button
        type="button"
        className={`w-full max-w-[416px] ${isPlaying ? 'bg-white text-primary hover:bg-white' : ''}`}
        size="lg"
        disabled={!hasRecording}
        onClick={onTogglePlay}
      >
        {isPlaying ? tSummary('completionPause') : tSummary('completionPlayRecording')}
      </Button>
    </div>
  );
}
