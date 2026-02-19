'use client';

import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export type SessionStatusTab = 'scheduled' | 'completed';

interface SessionStatusTabsProps {
  scheduledLabel: string;
  completedLabel: string;
  value?: SessionStatusTab;
  onChange?: (value: SessionStatusTab) => void;
}

export default function SessionStatusTabs({
  scheduledLabel,
  completedLabel,
  value,
  onChange,
}: SessionStatusTabsProps) {
  return (
    <Tabs
      value={value ?? 'scheduled'}
      onValueChange={(value) => onChange?.(value as SessionStatusTab)}
      className="w-fit"
    >
      <TabsList className="h-auto gap-[23px] bg-transparent p-0">
        <TabsTrigger
          value="scheduled"
          className="relative h-auto w-[119px] rounded-none bg-transparent p-0 font-pretendard text-[24px] font-semibold leading-[160%] text-label-alternative data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none after:pointer-events-none after:absolute after:left-0 after:top-full after:hidden after:h-[5px] after:w-full after:translate-y-[3px] after:rounded-[999px] after:bg-primary data-[state=active]:after:block"
        >
          {scheduledLabel}
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="relative h-auto w-[119px] rounded-none bg-transparent p-0 font-pretendard text-[24px] font-semibold leading-[160%] text-label-alternative data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none after:pointer-events-none after:absolute after:left-0 after:top-full after:hidden after:h-[5px] after:w-full after:translate-y-[3px] after:rounded-[999px] after:bg-primary data-[state=active]:after:block"
        >
          {completedLabel}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
