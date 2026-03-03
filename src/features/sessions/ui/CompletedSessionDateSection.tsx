'use client';

import Divider from '@/shared/ui/divider';
import type { CompletedSessionGroup } from '../types/session-list';
import CompletedSessionItemCard from './CompletedSessionItemCard';
import { cn } from '@/shared/lib/utils';

interface CompletedSessionDateSectionProps {
  group: CompletedSessionGroup;
  dateText: string;
  minutesUnit: string;
  viewMode?: 'list' | 'calendar';
}

export default function CompletedSessionDateSection({
  group,
  dateText,
  minutesUnit,
  viewMode,
}: CompletedSessionDateSectionProps) {
  return (
    <section
      className={cn(
        'flex w-full flex-col',
        viewMode === 'list'
          ? 'gap-[23px]'
          : 'counselor-inquiry-scroll bg-neutral-99 gap-[37px] px-8 py-[21px] h-full min-h-0 overflow-y-auto',
      )}
    >
      <div className="flex w-full flex-col items-start gap-[10px]">
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
            <CompletedSessionItemCard item={item} minutesUnit={minutesUnit} viewMode={viewMode} />
          </li>
        ))}
      </ul>
    </section>
  );
}
