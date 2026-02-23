'use client';

import { Button } from '@/shared/ui/button';

interface SessionAudioControlsProps {
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

export default function SessionAudioControls({
  locale,
  isPaused,
  isStartDisabled,
  isPauseDisabled,
  onStart,
  onPauseResume,
  onAddDemoDialogue,
}: SessionAudioControlsProps) {
  return (
    <div className="flex w-full max-w-[638px]flex-col gap-3 rounded-[24px] border border-neutral-95 bg-white p-4">
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
