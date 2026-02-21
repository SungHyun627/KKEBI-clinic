'use client';

import Divider from '@/shared/ui/divider';
import type { CompletedSessionGroup } from '../types/session-list';

interface CompletedSessionDateSectionProps {
  group: CompletedSessionGroup;
  dateText: string;
  minutesUnit: string;
  formatDate: (value: string) => string;
}

export default function CompletedSessionDateSection({
  group,
  dateText,
  minutesUnit,
  formatDate,
}: CompletedSessionDateSectionProps) {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col items-start gap-[10px]">
        <p className="body-16 font-medium text-label-normal">{dateText}</p>
        <Divider className="w-full" />
        <Divider className="w-full" />
      </div>

      <ul className="flex w-full flex-col rounded-2xl border border-neutral-95 bg-white">
        {group.items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[2fr_1fr_1fr] items-center gap-3 border-b border-neutral-95 px-4 py-3 last:border-b-0"
          >
            <span className="body-16 min-w-0 truncate text-label-normal">{item.clientName}</span>
            <span className="body-16 text-label-normal">{formatDate(item.counselingDate)}</span>
            <span className="body-16 text-label-normal">
              {item.counselingDurationMinutes}
              {minutesUnit}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
