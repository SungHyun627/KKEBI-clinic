import Image from 'next/image';
import { Button } from '@/shared/ui/button';

interface CompletionCardProps {
  locale: string;
  duration: string;
  endedAt: string;
  hasRecording: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function CompletionCard({
  locale,
  duration,
  endedAt,
  hasRecording,
  isPlaying,
  onTogglePlay,
}: CompletionCardProps) {
  return (
    <div className="rounded-[20px] bg-[rgba(66,158,0,0.10)] p-6">
      <div className="flex items-center gap-3">
        <Image src="/icons/checkmark.svg" alt="" width={20} height={20} />
        <span className="body-18 font-semibold text-[#2D7A00]">
          {locale === 'en' ? 'Session completed' : '상담이 완료되었습니다'}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 body-14 text-label-normal">
        <span>{duration}</span>
        <span>•</span>
        <span>{endedAt}</span>
      </div>
      <Button
        type="button"
        variant="outline"
        className="mt-4 h-10 rounded-[10px] border-neutral-95 bg-white"
        disabled={!hasRecording}
        onClick={onTogglePlay}
      >
        <Image
          src={isPlaying ? '/icons/pause.svg' : '/icons/play.svg'}
          alt=""
          width={18}
          height={18}
        />
        {isPlaying
          ? locale === 'en'
            ? 'Pause'
            : '일시정지'
          : locale === 'en'
            ? 'Play recording'
            : '녹음 재생'}
      </Button>
    </div>
  );
}
