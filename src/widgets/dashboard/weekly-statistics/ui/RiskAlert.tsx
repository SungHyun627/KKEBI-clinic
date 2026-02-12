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
    <div className="flex w-full flex-col gap-2 rounded-[20px] border border-neutral-95 bg-white p-4">
      <div className="flex w-full items-start justify-between gap-3 rounded-xl bg-neutral-99 p-3">
        <div className="min-w-0">
          <p className="body-14 font-semibold text-label-normal">{alert.clientName}</p>
          <p className="body-14 mt-1 text-neutral-40">{alert.reason}</p>
        </div>
        <Button
          type="button"
          size="sm"
          className="shrink-0"
          onClick={() => router.push(alert.detailPath)}
        >
          즉시 확인
        </Button>
      </div>
    </div>
  );
};

export default RiskAlert;
