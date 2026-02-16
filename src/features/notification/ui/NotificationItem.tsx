import { useLocale, useTranslations } from 'next-intl';
import type { NotificationItem as NotificationItemType } from '@/features/notification/types/notification';
import { getClientNameByLocale } from '@/shared/lib/clientNameByLocale';
import NotificationTypeChip from './NotificationTypeChip';

interface NotificationItemProps {
  notification: NotificationItemType;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const tNotification = useTranslations('notification');
  const locale = useLocale();
  const localizedClientName =
    'name' in notification
      ? getClientNameByLocale(notification.clientId, notification.name, locale)
      : getClientNameByLocale(notification.clientId, '', locale);
  const localizedCreatedAt = notification.createdAtKey
    ? tNotification(notification.createdAtKey, notification.createdAtParams ?? {})
    : (notification.createdAt ?? '');
  const localizedDescription = notification.descriptionKey
    ? tNotification(notification.descriptionKey, {
        ...(notification.descriptionParams ?? {}),
        name: localizedClientName,
      })
    : (notification.description ?? '');

  return (
    <div className="flex w-full flex-col items-start gap-[18px] rounded-2xl bg-white p-5 text-left">
      <div className="flex w-full items-center justify-between">
        <NotificationTypeChip type={notification.type} />
        <span className="body-14 text-label-alternative align-center">{localizedCreatedAt}</span>
      </div>
      <div className="body-14 text-label-normal">{localizedDescription}</div>
    </div>
  );
}
