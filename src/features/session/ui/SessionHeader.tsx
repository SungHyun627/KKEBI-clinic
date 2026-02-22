'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LocaleSwitchButton } from '@/shared/ui/locale-switch-button';
import { getSessionStartContext } from '@/shared/lib/session-start-context';
import type { SessionStartContextValue } from '@/shared/lib/session-start-context';
import SessionTypeChip from '@/widgets/dashboard/today-schedule/ui/SessionTypeChip';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import type { SessionPageData } from '../types/session-page';

interface SessionHeaderProps {
  sessionId: string;
  sessionData?: Pick<SessionPageData, 'clientName' | 'sessionType' | 'riskType'>;
}

export default function SessionHeader({ sessionId, sessionData }: SessionHeaderProps) {
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [context, setContext] = useState<SessionStartContextValue | null>(null);

  useEffect(() => {
    setContext(getSessionStartContext(sessionId));
  }, [sessionId]);

  const clientName = sessionData?.clientName ?? context?.name?.trim() ?? tCommon('defaultUserName');
  const sessionType = sessionData?.sessionType ?? context?.sessionType;
  const riskType = sessionData?.riskType ?? context?.riskType;

  return (
    <div className="flex w-full justify-between p-5">
      <div className="flex items-center gap-4">
        <span className="body-18 font-semibold text-label-normal">
          {clientName}
          {tCommon('profileSuffix')}
        </span>
        <div className="flex items-center gap-2">
          {sessionType ? <SessionTypeChip value={sessionType} /> : null}
          {riskType ? <RiskTypeChip value={riskType} /> : null}
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex items-center gap-[19px] max-w-[135px] w-full">
          <Button onClick={() => {}} className="h-[38px] w-[92px] rounded-[8px]">
            상담 종료
          </Button>
          <Button
            variant="icon"
            onClick={() => router.back()}
            className="p-0 border-none hover:bg-white h-6 w-6"
          >
            <Image src="/icons/backward.svg" alt="" width={24} height={24} />
          </Button>
        </div>
        <LocaleSwitchButton />
      </div>
    </div>
  );
}
