'use client';

import type { ScheduledSessionGroup } from '../types/session-list';
import Divider from '@/shared/ui/divider';
import ScheduledSessionItemCard from './ScheduledSessionItemCard';

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
  return (
    <section className="flex w-full flex-col gap-[23px]">
      <div className="flex flex-col gap-[10px] w-full">
        <p className="body-18 font-medium text-label-normal">{dateText}</p>
        <Divider />
      </div>
      <ul className="flex w-full flex-col items-start bg-white gap-4">
        {group.items.map((item) => (
          <li key={item.id} className="flex w-full">
            <ScheduledSessionItemCard
              item={item}
              scheduledDate={group.date}
              moodLabel={moodLabel}
              stressLabel={stressLabel}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
