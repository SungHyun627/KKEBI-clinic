'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import MoodScoreChip from '@/shared/ui/chips/mood-score-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import StreakChip from '@/shared/ui/chips/streak-chip';
import Divider from '@/shared/ui/divider';
import SessionTypeChip from '@/features/dashboard/today-schedule/ui/SessionTypeChip';
import { useLocale, useTranslations } from 'next-intl';
import type { ScheduledSessionItem } from '../types/session-list';
import RescheduleSessionDialog from './RescheduleSessionDialog';
import { useRouter } from '@/i18n/navigation';
import { setSessionStartContext } from '@/shared/lib/session-start-context';
import SessionReminderDrawer from '@/features/sessions/session-reminder/ui/SessionReminderDrawer';
import { getClientNameByLocale } from '@/shared/lib/clientNameByLocale';
import { cn } from '@/shared/lib/utils';

interface ScheduledSessionItemCardProps {
  item: ScheduledSessionItem;
  scheduledDate: string;
  moodLabel: string;
  stressLabel: string;
  viewMode?: 'list' | 'calendar';
}

export default function ScheduledSessionItemCard({
  item,
  scheduledDate,
  moodLabel,
  stressLabel,
  viewMode,
}: ScheduledSessionItemCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const tSessions = useTranslations('sessionList');
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const localizedClientName = getClientNameByLocale(item.clientId, item.clientName, locale);
  const dateMatch = scheduledDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = item.scheduledTime.match(/^(\d{2}):(\d{2})$/);
  const sessionStartUtcMs =
    dateMatch && timeMatch
      ? Date.UTC(
          Number(dateMatch[1]),
          Number(dateMatch[2]) - 1,
          Number(dateMatch[3]),
          Number(timeMatch[1]) - 9,
          Number(timeMatch[2]),
          0,
        )
      : Number.NaN;
  const canStartSession =
    Number.isFinite(sessionStartUtcMs) && nowMs >= sessionStartUtcMs - 30 * 60 * 1000;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 30_000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const handleStart = () => {
    setSessionStartContext(item.id, {
      name: localizedClientName,
      sessionType: item.sessionType,
      riskType: item.riskType,
    });
    router.push(`/session/${item.id}?returnTo=${encodeURIComponent(`/${locale}/sessions`)}`);
  };

  return (
    <div
      className={cn(
        'flex flex-col w-full items-start p-[26px] gap-[18px] justify-center rounded-3xl',
        viewMode === 'calendar' ? 'bg-white' : 'bg-neutral-99',
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="body-20 font-semibold">
            {item.clientName}
            {tCommon('profileSuffix')}
          </span>
          <StreakChip days={item.streakDays} responsiveCompact />
        </div>
        <div className="flex w-[235px] items-center gap-3">
          <Button
            type="button"
            variant="icon"
            size="icon"
            onClick={() => setIsReminderOpen(true)}
            aria-label={tSessions('sendAria')}
            className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
          >
            <Image src="/icons/sent.svg" alt="" width={24} height={24} aria-hidden />
          </Button>
          <Button
            type="button"
            size="md"
            className="w-full max-w-[181px]"
            disabled={!canStartSession}
            onClick={handleStart}
          >
            {tCommon('start')}
          </Button>
        </div>
      </div>

      <Divider />
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex items-center gap-6">
            <span className="body-14 text-neutral-60 min-w-[52px]">
              {tSessions('scheduledScheduleLabel')}
            </span>
            <div className="flex items-center gap-2">
              <span className="body-18 font-semibold text-neutral-30">{item.scheduledTime}</span>
              <button
                className="flex items-center justify-center rounded-[8px] bg-[rgba(250,84,84,0.10)] px-3 py-[6px] text-primary hover:cursor-pointer"
                onClick={() => setIsRescheduleOpen(true)}
              >
                {tCommon('change')}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="body-14 text-neutral-60 min-w-[52px]">
              {tSessions('scheduledTypeLabel')}
            </span>
            <SessionTypeChip value={item.sessionType} />
          </div>
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-6">
              <span className="body-14 text-neutral-60 min-w-[52px]">
                {tSessions('scheduledRiskLabel')}
              </span>
              <RiskTypeChip value={item.riskType} />
            </div>
            {viewMode === 'calendar' && (
              <div className="flex gap-3 flex-wrap justify-end">
                <MoodScoreChip label={moodLabel} score={item.moodScore} />
                <MoodScoreChip label={stressLabel} score={item.stressScore} />
              </div>
            )}
          </div>
        </div>
        {viewMode === 'list' && (
          <div className="flex gap-3">
            <MoodScoreChip label={moodLabel} score={item.moodScore} />
            <MoodScoreChip label={stressLabel} score={item.stressScore} />
          </div>
        )}
      </div>

      <RescheduleSessionDialog
        sessionId={item.id}
        open={isRescheduleOpen}
        onOpenChange={setIsRescheduleOpen}
        currentDate={scheduledDate}
        initialStartTime={item.scheduledTime}
      />
      <SessionReminderDrawer
        open={isReminderOpen}
        onOpenChange={setIsReminderOpen}
        sessionId={item.id}
        clientName={localizedClientName}
        scheduledTime={item.scheduledTime}
      />
    </div>
  );
}
