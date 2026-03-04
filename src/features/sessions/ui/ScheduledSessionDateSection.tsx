'use client';

import type { ScheduledSessionGroup } from '../types/session-list';
import Divider from '@/shared/ui/divider';
import ScheduledSessionItemCard from './ScheduledSessionItemCard';
import { cn } from '@/shared/lib/utils';

interface ScheduledSessionDateSectionProps {
  group: ScheduledSessionGroup;
  dateText: string;
  moodLabel: string;
  stressLabel: string;
  viewMode?: 'list' | 'calendar';
}

export default function ScheduledSessionDateSection({
  group,
  dateText,
  moodLabel,
  stressLabel,
  viewMode,
}: ScheduledSessionDateSectionProps) {
  return (
    <section
      className={cn(
        'flex w-full flex-col',
        viewMode === 'list'
          ? 'gap-[23px]'
          : 'counselor-inquiry-scroll bg-neutral-99 gap-[37px] px-8 py-[21px] h-full min-h-0 overflow-y-auto',
      )}
    >
      <div className="flex flex-col gap-[10px] w-full">
        <p
          className={cn(
            viewMode === 'list'
              ? 'body-18 font-medium text-label-normal'
              : 'body-20 font-semibold text-label-strong',
          )}
        >
          {dateText}
        </p>
        {viewMode === 'list' && <Divider />}
      </div>
      <ul
        className={cn(
          'flex w-full flex-col items-start gap-4',
          viewMode === 'list' ? 'bg-white' : 'bg-neutral-99',
        )}
      >
        {group.items.map((item) => (
          <li key={item.id} className="flex w-full">
            <ScheduledSessionItemCard
              item={item}
              scheduledDate={group.date}
              moodLabel={moodLabel}
              stressLabel={stressLabel}
              viewMode={viewMode}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
