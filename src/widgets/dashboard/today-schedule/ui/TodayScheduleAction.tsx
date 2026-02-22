'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { startSession } from '@/features/sessions/api/startSession';
import { toast } from '@/shared/ui/toast';

interface TodayScheduleActionProps {
  clientId: string;
  scheduleId?: string;
  clientName: string;
}

export default function TodayScheduleAction({
  clientId,
  scheduleId,
  clientName,
}: TodayScheduleActionProps) {
  const tDashboard = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    const result = await startSession({ clientId, scheduleId, source: 'dashboard' });
    setIsStarting(false);

    if (!result.success || !result.sessionId) {
      toast(result.message || tDashboard('todayScheduleLoadFailed'));
      return;
    }

    router.push(`/session/${result.sessionId}`);
  };

  return (
    <div className="flex min-w-0 w-full items-center justify-end gap-2 pl-2">
      <Button
        type="button"
        variant="icon"
        size="icon"
        disabled
        aria-label={tDashboard('todayScheduleSendNotification', { name: clientName })}
        className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
      >
        <Image src="/icons/sent.svg" alt="" width={24} height={24} aria-hidden />
      </Button>
      <Button
        type="button"
        size="md"
        className="w-full"
        disabled={isStarting}
        onClick={handleStart}
      >
        {tCommon('start')}
      </Button>
    </div>
  );
}
