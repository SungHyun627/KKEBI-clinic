'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import StreakChip from '@/shared/ui/chips/streak-chip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import { DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import type { ClientLookupItem } from '../types/client';
import { useLocale, useTranslations } from 'next-intl';
import { getClientNameByLocale } from '@/shared/lib/clientNameByLocale';
import { startSession } from '@/features/sessions/api/startSession';
import { toast } from '@/shared/ui/toast';

interface ClientDetailHeaderProps {
  client: ClientLookupItem;
}

export default function ClientDetailHeader({ client }: ClientDetailHeaderProps) {
  const router = useRouter();
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const tDashboard = useTranslations('dashboard');
  const localizedClientName = getClientNameByLocale(client.clientId, client.clientName, locale);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    const result = await startSession({ clientId: client.clientId, source: 'client-detail' });
    setIsStarting(false);

    if (!result.success || !result.sessionId) {
      toast(result.message || tCommon('underConstruction'));
      return;
    }

    router.push(`/session/${result.sessionId}`);
  };

  return (
    <DrawerHeader className="flex w-full items-center justify-between p-0">
      <div className="flex min-w-0 items-center gap-3">
        <DrawerTitle className="text-[24px] font-semibold leading-[30px] text-label-strong">
          {localizedClientName}
        </DrawerTitle>
        <StreakChip days={client.streakDays} />
        <RiskTypeChip value={client.riskType} />
      </div>
      <div className="flex w-full max-w-[235px] items-center gap-3">
        <Button
          type="button"
          variant="icon"
          size="icon"
          disabled
          aria-label={tDashboard('todayScheduleSendNotification', { name: localizedClientName })}
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
    </DrawerHeader>
  );
}
