'use client';

import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import type { RiskNotification } from '@/features/notification/types/notification';
import { Button } from '@/shared/ui/button';
import { getClientNameByLocale } from '@/shared/lib/clientNameByLocale';

interface RiskNotificationItemProps {
  notification: RiskNotification;
  onImmediateCheck?: () => void;
}

export default function RiskNotificationItem({
  notification,
  onImmediateCheck,
}: RiskNotificationItemProps) {
  const tCommon = useTranslations('common');
  const tNotification = useTranslations('notification');
  const locale = useLocale();
  const router = useRouter();
  const localizedClientName = getClientNameByLocale(
    notification.clientId,
    notification.name,
    locale,
  );
  const localizedDescription = notification.descriptionKey
    ? tNotification(notification.descriptionKey, {
        name: localizedClientName,
        ...(notification.descriptionParams ?? {}),
      })
    : (notification.description ?? '');

  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-2xl bg-white p-5 text-left">
      <div className="flex min-w-0 flex-col items-start gap-[6px]">
        <p className="body-16 font-semibold text-label-normal">{localizedClientName}</p>
        <p className="body-14 w-full min-w-0 truncate text-neutral-40">{localizedDescription}</p>
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
        {tCommon('checkNow')}
      </Button>
    </div>
  );
}
