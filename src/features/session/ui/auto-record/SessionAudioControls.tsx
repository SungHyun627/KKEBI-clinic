'use client';

import { Button } from '@/shared/ui/button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface SessionAudioControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isStartDisabled: boolean;
  isPauseDisabled: boolean;
  onStart: () => void;
  onPauseResume: () => void;
  onSwitchSpeaker: () => void;
}

export default function SessionAudioControls({
  isRecording,
  isPaused,
  isStartDisabled,
  isPauseDisabled,
  onStart,
  onPauseResume,
  onSwitchSpeaker,
}: SessionAudioControlsProps) {
  const tSession = useTranslations('sessionList');

  return (
    <div className="flex w-full max-w-[638px] h-[155px] items-center justify-center rounded-[24px] border border-neutral-95 bg-fill-alternative px-[clamp(16px,12vw,216px)] py-5 backdrop-blur-[11.5px]">
      <div className="flex items-center gap-8">
        {!isRecording ? (
          <Button
            type="button"
            size="sm"
            className="w-[104px] h-[104px] rounded-full"
            onClick={onStart}
            disabled={isStartDisabled}
          >
            <Image src="/icons/mic.svg" alt={tSession('audioStartAlt')} width={50} height={50} />
          </Button>
        ) : (
          <>
            <Button
              type="button"
              size="sm"
              className="h-[72px] w-[72px] rounded-full bg-label-alternative hover:bg-label-assistive"
              onClick={onPauseResume}
              disabled={isPauseDisabled}
            >
              <Image
                src={isPaused ? '/icons/play.svg' : '/icons/pause.svg'}
                alt={isPaused ? tSession('audioResumeAlt') : tSession('audioPauseAlt')}
                width={28}
                height={28}
              />
            </Button>
            <Button
              type="button"
              size="sm"
              className="w-[104px] h-[104px] rounded-full bg-white border border-neutral-95 hover:bg-white"
              onClick={onSwitchSpeaker}
            >
              <Image
                src="/icons/waveform.svg"
                alt={tSession('audioSwitchSpeakerAlt')}
                width={50}
                height={50}
              />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
