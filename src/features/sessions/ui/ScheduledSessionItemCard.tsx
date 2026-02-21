'use client';

import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import MoodScoreChip from '@/shared/ui/chips/mood-score-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import StreakChip from '@/shared/ui/chips/streak-chip';
import Divider from '@/shared/ui/divider';
import SessionTypeChip from '@/widgets/dashboard/today-schedule/ui/SessionTypeChip';
import { useTranslations } from 'next-intl';
import type { ScheduledSessionItem } from '../types/session-list';

interface ScheduledSessionItemCardProps {
  item: ScheduledSessionItem;
  moodLabel: string;
  stressLabel: string;
  onStart: (clientId: string) => void;
}

export default function ScheduledSessionItemCard({
  item,
  moodLabel,
  stressLabel,
  onStart,
}: ScheduledSessionItemCardProps) {
  const tCommon = useTranslations('common');

  return (
    <div className="flex flex-col w-full items-start p-[26px] gap-[18px] justify-center rounded-3xl bg-neutral-99">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="body-20 font-semibold">
            {item.clientName}
            {tCommon('profileSuffix')}
          </span>
          <StreakChip days={item.streakDays} responsiveCompact />
        </div>
        <div className="flex w-full max-w-[235px] items-center gap-3">
          <Button
            type="button"
            variant="icon"
            size="icon"
            disabled
            aria-label="전송하기"
            className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
          >
            <Image src="/icons/sent.svg" alt="" width={24} height={24} aria-hidden />
          </Button>
          <Button
            type="button"
            size="md"
            className="w-full w-max-[181px]"
            onClick={() => onStart(item.clientId)}
          >
            {tCommon('start')}
          </Button>
        </div>
      </div>

      <Divider />
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full max-w-[268px] flex-col items-start gap-4">
          <div className="flex items-center gap-6">
            <span className="body-14 text-neutral-60 min-w-[52px]">상담 일정</span>
            <div className="flex items-center gap-2">
              <span className="body-18 font-semibold text-neutral-30">{item.scheduledTime}</span>
              <button
                onClick={() => {}}
                className="flex items-center justify-center rounded-[8px] bg-[rgba(250,84,84,0.10)] px-3 py-[6px] text-primary hover:cursor-pointer"
              >
                {tCommon('change')}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="body-14 text-neutral-60 min-w-[52px]">상담 유형</span>
            <SessionTypeChip value={item.sessionType} />
          </div>
          <div className="flex items-center gap-6">
            <span className="body-14 text-neutral-60 min-w-[52px]">위험도</span>
            <RiskTypeChip value={item.riskType} />
          </div>
        </div>
        <div className="flex gap-3">
          <MoodScoreChip label={moodLabel} score={item.moodScore} />
          <MoodScoreChip label={stressLabel} score={item.stressScore} />
        </div>
      </div>
    </div>
  );
}
