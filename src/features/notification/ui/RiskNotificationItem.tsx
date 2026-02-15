'use client';

import { useRouter } from '@/i18n/navigation';
import type { RiskNotification } from '@/features/notification/types/notification';
import { Button } from '@/shared/ui/button';

interface RiskNotificationItemProps {
  notification: RiskNotification;
  onImmediateCheck?: () => void;
}

export default function RiskNotificationItem({
  notification,
  onImmediateCheck,
}: RiskNotificationItemProps) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-2xl bg-white p-5 text-left">
      <div className="flex min-w-0 flex-col items-start gap-[6px]">
        <p className="body-16 font-semibold text-label-normal">{notification.name}</p>
        <p className="body-14 w-full min-w-0 truncate text-neutral-40">
          {notification.description}
        </p>
      </div>
      <Button
        className="w-full"
        type="button"
        size="md"
        onClick={() => {
          onImmediateCheck?.();
          router.push(`/clients?clientId=${encodeURIComponent(notification.clientId)}`);
        }}
      >
        즉시 확인하기
      </Button>
    </div>
  );
}
