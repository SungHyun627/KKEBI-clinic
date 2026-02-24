'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { startSession } from '@/features/sessions/api/startSession';
import { toast } from '@/shared/ui/toast';
import type { RiskType, SessionType } from '@/features/dashboard/types/schedule';
import { setSessionStartContext } from '@/shared/lib/session-start-context';
import SessionReminderDrawer from '@/features/notification/ui/SessionReminderDrawer';

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
  const [isStarting, setIsStarting] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    const result = await startSession({ clientId, scheduleId, source: 'dashboard' });
    setIsStarting(false);

    if (!result.success || !result.sessionId) {
      toast(result.message || tDashboard('todayScheduleLoadFailed'));
      return;
    }

    setSessionStartContext(result.sessionId, {
      name: clientName,
      sessionType: sessionType,
      riskType: riskType,
    });
    router.push(`/session/${result.sessionId}?returnTo=${encodeURIComponent(`/${locale}`)}`);
  };

  return (
    <div className="flex min-w-0 w-full items-center justify-end gap-2 pl-2">
      <Button
        type="button"
        variant="icon"
        size="icon"
        onClick={() => setIsReminderOpen(true)}
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
      <SessionReminderDrawer
        open={isReminderOpen}
        onOpenChange={setIsReminderOpen}
        clientId={clientId}
        clientName={clientName}
        scheduledTime={scheduledTime}
      />
    </div>
  );
}
