'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toast';
import type { RiskType, SessionType } from '@/features/dashboard/types/schedule';
import { setSessionStartContext } from '@/shared/lib/session-start-context';
import SessionReminderDrawer from '@/features/sessions/session-reminder/ui/SessionReminderDrawer';

interface TodayScheduleActionProps {
  clientId: string;
  scheduleId?: string;
  clientName: string;
  scheduledTime?: string;
  sessionType: SessionType;
  riskType: RiskType;
}

export default function TodayScheduleAction({
  clientId,
  scheduleId,
  clientName,
  scheduledTime,
  sessionType,
  riskType,
}: TodayScheduleActionProps) {
  const tDashboard = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const handleStart = () => {
    if (!scheduleId) {
      toast(tDashboard('todayScheduleLoadFailed'));
      return;
    }

    setSessionStartContext(scheduleId, {
      name: clientName,
      sessionType: sessionType,
      riskType: riskType,
    });
    router.push(`/session/${scheduleId}?returnTo=${encodeURIComponent(`/${locale}`)}`);
  };

  return (
    <div className="flex min-w-0 w-full items-center justify-end gap-2 pl-2">
      <Button
        type="button"
        variant="icon"
        size="icon"
        onClick={() => setIsReminderOpen(true)}
        aria-label={tDashboard('todayScheduleSendNotification', { name: clientName })}
        disabled={!scheduleId}
        className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
      >
        <Image src="/icons/sent.svg" alt="" width={24} height={24} aria-hidden />
      </Button>
      <Button
        type="button"
        size="md"
        className="w-full"
        disabled={!scheduleId}
        onClick={handleStart}
      >
        {tCommon('start')}
      </Button>
      <SessionReminderDrawer
        open={isReminderOpen}
        onOpenChange={setIsReminderOpen}
        sessionId={scheduleId ?? ''}
        clientId={clientId}
        clientName={clientName}
        scheduledTime={scheduledTime}
      />
    </div>
  );
}
