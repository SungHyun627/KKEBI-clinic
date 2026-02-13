'use client';

import { useRouter } from 'next/navigation';
import type { RiskAlert as RiskAlertType } from '@/features/dashboard';
import { Button } from '@/shared/ui/button';

interface RiskAlertProps {
  alert: RiskAlertType;
}

const RiskAlert = ({ alert }: RiskAlertProps) => {
  const router = useRouter();

  return (
    <div className="flex h-32 w-full min-w-0 flex-col rounded-[20px] border border-neutral-95 bg-white px-7 py-[23px]">
      <div className="flex h-full w-full min-w-0 items-center justify-between gap-3 rounded-xl bg-fill-pressed px-4">
        <div className="flex min-w-0 flex-col items-start gap-2">
          <p className="body-16 font-semibold text-label-normal">{alert.clientName}</p>
          <p className="body-14 w-full min-w-0 truncate text-neutral-40">{alert.reason}</p>
        </div>
        <Button
          type="button"
          size="sm"
          className="shrink-0"
          onClick={() => router.push(`/clients?clientId=${encodeURIComponent(alert.clientId)}`)}
        >
          확인하기
        </Button>
      </div>
    </div>
  );
};

export default RiskAlert;
