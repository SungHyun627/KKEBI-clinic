import { useTranslations } from 'next-intl';
import type { NotificationApiType } from '@/features/notification/types/notification';
import { getNotificationTypeLabelKey } from '@/features/notification/lib/notification-routing';

interface NotificationTypeChipProps {
  type: NotificationApiType;
}

export default function NotificationTypeChip({ type }: NotificationTypeChipProps) {
  const tNotification = useTranslations('notification');
  const labelKey = getNotificationTypeLabelKey(type);
  const isScheduleType = type === 'SCHEDULE_CHANGE_REQUEST';
  const isRiskType = type === 'HIGH_PHQ9' || type === 'APP_INACTIVE';

  return (
    <span
      className={`body-12 flex items-center justify-center rounded-[100px] border px-[8px] py-[3px] font-medium ${
        isRiskType
          ? 'border-[rgba(229,34,34,0.50)] bg-[rgba(229,34,34,0.10)] text-status-negative'
          : isScheduleType
            ? 'border-[rgba(66,158,0,0.50)] bg-[rgba(66,158,0,0.10)] text-[#429E00]'
            : 'border-neutral-90 bg-neutral-97 text-label-alternative'
      }`}
    >
      {tNotification(labelKey)}
    </span>
  );
}
