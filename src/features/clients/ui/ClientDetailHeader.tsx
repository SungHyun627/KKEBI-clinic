'use client';

import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import StreakChip from '@/shared/ui/chips/streak-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import { DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import type { ClientLookupItem } from '../types/client';
import { useTranslations } from 'next-intl';

interface ClientDetailHeaderProps {
  client: ClientLookupItem;
}

export default function ClientDetailHeader({ client }: ClientDetailHeaderProps) {
  const router = useRouter();
  const tCommon = useTranslations('common');
  const tDashboard = useTranslations('dashboard');

  return (
    <DrawerHeader className="flex w-full items-center justify-between p-0">
      <div className="flex min-w-0 items-center gap-3">
        <DrawerTitle className="text-[24px] font-semibold leading-[30px] text-label-strong">
          {client.clientName}
        </DrawerTitle>
        <StreakChip days={client.streakDays} />
        <RiskTypeChip value={client.riskType} />
      </div>
      <div className="flex w-full max-w-[235px] items-center gap-3">
        <Button
          type="button"
          variant="icon"
          size="icon"
          aria-label={tDashboard('todayScheduleSendNotification', { name: client.clientName })}
          className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] shrink-0 rounded-[12px] border-neutral-95 p-0"
        >
          <Image src="/icons/sent.svg" alt="send-notification" width={24} height={24} aria-hidden />
        </Button>
        <Button
          type="button"
          size="md"
          className="w-full"
          onClick={() => router.push(`/sessions/${client.clientId}`)}
        >
          {tCommon('start')}
        </Button>
      </div>
    </DrawerHeader>
  );
}
