'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import RecordCompleteChip from '@/shared/ui/chips/record-complete-chip';
import Divider from '@/shared/ui/divider';
import type { CompletedSessionItem } from '../types/session-list';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

interface CompletedSessionItemCardProps {
  item: CompletedSessionItem;
  minutesUnit: string;
  viewMode?: 'list' | 'calendar';
}

const formatCompactDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};

export default function CompletedSessionItemCard({
  item,
  minutesUnit,
  viewMode,
}: CompletedSessionItemCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const tSessions = useTranslations('sessionList');

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
          <RecordCompleteChip />
        </div>
        <div className="flex w-full max-w-[181px] items-center gap-3">
          <Button
            type="button"
            size="md"
            className="w-full w-max-[181px]"
            onClick={() => {
              router.push(`/${locale}/session/${encodeURIComponent(item.id)}/summary`);
            }}
          >
            {tSessions('viewDetails')}
          </Button>
        </div>
      </div>

      <Divider />

      <div className="flex w-full items-center justify-between">
        <div className="flex w-full max-w-[268px] flex-col items-start gap-4">
          <div className="flex items-center gap-6">
            <span className="body-14 min-w-[52px] text-neutral-60">
              {tSessions('completedScheduleLabel')}
            </span>
            <span className="body-16 font-medium text-neutral-30">
              {formatCompactDate(item.counselingDate)}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="body-14 min-w-[52px] text-neutral-60">
              {tSessions('completedTypeLabel')}
            </span>
            <span className="body-16 font-medium text-neutral-30">
              {item.counselingDurationMinutes}
              {locale === 'ko' ? '분' : minutesUnit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
