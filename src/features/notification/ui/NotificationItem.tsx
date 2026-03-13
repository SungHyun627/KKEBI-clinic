import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { NotificationItem as NotificationItemType } from '@/features/notification/types/notification';
import { buildNotificationTargetPath } from '@/features/notification/lib/notification-routing';
import NotificationTypeChip from './NotificationTypeChip';

interface NotificationItemProps {
  notification: NotificationItemType;
  onClick?: (notification: NotificationItemType) => Promise<void> | void;
}

const formatRelativeTime = (value: string, locale: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  const rtf = new Intl.RelativeTimeFormat(locale === 'en' ? 'en' : 'ko', { numeric: 'auto' });

  if (Math.abs(diffMs) < hourMs) {
    return rtf.format(-Math.round(diffMs / minuteMs), 'minute');
  }

  if (Math.abs(diffMs) < dayMs) {
    return rtf.format(-Math.round(diffMs / hourMs), 'hour');
  }

  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();

  const targetPath = useMemo(() => buildNotificationTargetPath(notification), [notification]);
  const createdAtLabel = formatRelativeTime(notification.createdAt, locale);

  return (
    <button
      type="button"
      className={`flex w-full flex-col items-start gap-3 rounded-2xl bg-white p-5 text-left hover:cursor-pointer ${
        notification.isRead ? 'opacity-60' : 'opacity-100'
      }`}
      onClick={async () => {
        await onClick?.(notification);
        if (targetPath) {
          router.push(targetPath);
        }
      }}
      aria-label={notification.title || tCommon('view')}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <NotificationTypeChip type={notification.type} />
        <span className="body-14 text-label-alternative">{createdAtLabel}</span>
      </div>
      <div className="flex w-full flex-col gap-1">
        {notification.title ? (
          <p className="body-16 font-semibold text-label-normal">{notification.title}</p>
        ) : null}
        <p className="body-14 text-label-normal">{notification.message}</p>
      </div>
    </button>
  );
}
