'use client';

import Divider from '@/shared/ui/divider';
import type { CompletedSessionGroup } from '../types/session-list';
import CompletedSessionItemCard from './CompletedSessionItemCard';

interface CompletedSessionDateSectionProps {
  group: CompletedSessionGroup;
  dateText: string;
  minutesUnit: string;
}

export default function CompletedSessionDateSection({
  group,
  dateText,
  minutesUnit,
}: CompletedSessionDateSectionProps) {
  return (
    <section className="flex w-full flex-col gap-[23px]">
      <div className="flex w-full flex-col items-start gap-[10px]">
        <p className="body-18 font-medium text-label-normal">{dateText}</p>
        <Divider />
      </div>

      <ul className="flex w-full flex-col items-start bg-white gap-4">
        {group.items.map((item) => (
          <li key={item.id} className="flex w-full">
            <CompletedSessionItemCard item={item} minutesUnit={minutesUnit} />
          </li>
        ))}
      </ul>
    </section>
  );
}
