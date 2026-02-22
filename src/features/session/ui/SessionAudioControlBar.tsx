'use client';

import Image from 'next/image';
import { Button } from '@/shared/ui/button';

interface SessionAudioControlBarProps {
  locale: string;
  isRecording: boolean;
  isPaused: boolean;
  elapsed: string;
  visibleAudioLevel: number;
  isStartDisabled: boolean;
  isPauseDisabled: boolean;
  onStart: () => void;
  onPauseResume: () => void;
  onAddDemoDialogue: () => void;
}

export default function SessionAudioControlBar({
  locale,
  isRecording,
  isPaused,
  elapsed,
  visibleAudioLevel,
  isStartDisabled,
  isPauseDisabled,
  onStart,
  onPauseResume,
  onAddDemoDialogue,
}: SessionAudioControlBarProps) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[24px] border border-neutral-95 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${
              isRecording && !isPaused ? 'bg-[#FA5454]' : 'bg-neutral-95'
            }`}
            aria-hidden
          />
          <span className="body-14 font-medium text-label-normal">
            {isRecording
              ? isPaused
                ? locale === 'en'
                  ? 'Paused'
                  : '일시정지'
                : locale === 'en'
                  ? 'Recording'
                  : '녹음 중'
              : locale === 'en'
                ? 'Ready'
                : '대기 중'}
          </span>
          <span className="body-14 text-label-alternative">{elapsed}</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/icons/speaker.svg" alt="" width={16} height={16} aria-hidden />
          <div className="flex items-end gap-1">
            {[20, 40, 60, 80, 100].map((threshold) => (
              <span
                key={threshold}
                className={`w-1 rounded-full transition-all ${
                  visibleAudioLevel >= threshold ? 'bg-primary' : 'bg-neutral-95'
                }`}
                style={{ height: threshold / 20 + 3 }}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="flex-1"
          onClick={onStart}
          disabled={isStartDisabled}
        >
          {locale === 'en' ? 'Start recording' : '녹음 시작'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="pause"
          className="flex-1"
          onClick={onPauseResume}
          disabled={isPauseDisabled}
        >
          {isPaused
            ? locale === 'en'
              ? 'Resume'
              : '재개'
            : locale === 'en'
              ? 'Pause'
              : '일시정지'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={onAddDemoDialogue}
        >
          {locale === 'en' ? 'Add demo dialogue' : '데모 대화 추가'}
        </Button>
      </div>
    </div>
  );
}
