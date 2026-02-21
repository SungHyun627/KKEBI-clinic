'use client';

import MoodScoreChip from '@/shared/ui/chips/mood-score-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import StreakChip from '@/shared/ui/chips/streak-chip';
import SessionTypeChip from '@/widgets/dashboard/today-schedule/ui/SessionTypeChip';
import type { ScheduledSessionGroup } from '../types/session-list';
import Divider from '@/shared/ui/divider';
import { Button } from '@/shared/ui/button';
import { useRouter } from '@/i18n/navigation';
import Image from 'next/image';

interface ScheduledSessionDateSectionProps {
  group: ScheduledSessionGroup;
  dateText: string;
  moodLabel: string;
  stressLabel: string;
}

export default function ScheduledSessionDateSection({
  group,
  dateText,
  moodLabel,
  stressLabel,
}: ScheduledSessionDateSectionProps) {
  const router = useRouter();
  return (
    <section className="flex w-full flex-col gap-[23px]">
      <div className="flex flex-col gap-[10px] w-full">
        <p className="body-18 font-medium text-label-normal">{dateText}</p>
        <Divider />
      </div>
      <ul className="flex w-full flex-col items-start bg-white gap-4">
        {group.items.map((item) => (
          <li key={item.id} className="flex w-full">
            <div className="flex flex-col w-full items-start p-[26px] gap-[18px] justify-center rounded-3xl bg-neutral-99">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="body-20 font-semibold">{item.clientName} 님</span>
                  <StreakChip days={item.streakDays} responsiveCompact />
                </div>
                <div className="flex w-full max-w-[235px] items-center gap-3">
                  <Button
                    type="button"
                    variant="icon"
                    size="icon"
                    disabled
                    aria-label={'전송하기'}
                    className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
                  >
                    <Image src="/icons/sent.svg" alt="" width={24} height={24} aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    size="md"
                    className="w-full w-max-[181px]"
                    onClick={() => router.push(`/sessions/${item.clientId}`)}
                  >
                    {'시작하기'}
                  </Button>
                </div>
              </div>

              <Divider />
              <div className="flex w-full justify-between items-center">
                <div className="flex flex-col w-full max-w-[268px] items-start gap-4">
                  <div className="flex items-center gap-6">
                    <span className="body-14 text-neutral-60 min-w-[52px]">상담 일정</span>
                    <div className="flex items-center gap-2">
                      <span className="body-18 font-semibold text-neutral-30">
                        {item.scheduledTime}
                      </span>
                      <button
                        onClick={() => {}}
                        className="flex items-center justify-center px-3 py-[6px] text-primary bg-[rgba(250,84,84,0.10)] hover:cursor-pointer rounded-[8px]"
                      >
                        일정 변경
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
          </li>
        ))}
      </ul>
    </section>
  );
}
