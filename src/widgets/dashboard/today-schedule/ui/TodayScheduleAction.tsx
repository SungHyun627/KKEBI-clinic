'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';

interface TodayScheduleActionProps {
  clientId: string;
  clientName: string;
}

export default function TodayScheduleAction({ clientId, clientName }: TodayScheduleActionProps) {
  const tDashboard = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-end gap-3 pl-6">
      <Button
        type="button"
        variant="icon"
        size="icon"
        aria-label={tDashboard('todayScheduleSendNotification', { name: clientName })}
        className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
      >
        <Image src="/icons/sent.svg" alt="" width={24} height={24} aria-hidden />
      </Button>
      <Button
        type="button"
        size="md"
        className="w-full"
        onClick={() => router.push(`/sessions/${clientId}`)}
      >
        {tCommon('start')}
      </Button>
    </div>
  );
}
