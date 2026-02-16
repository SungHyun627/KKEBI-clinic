import type { NotificationType } from '@/features/notification/types/notification';
import { useTranslations } from 'next-intl';

interface NotificationTypeChipProps {
  type: NotificationType;
}

export default function NotificationTypeChip({ type }: NotificationTypeChipProps) {
  const tNotification = useTranslations('notification');
  const isRisk = type === 'risk';

  return (
    <span
      className={`flex items-center justify-center rounded-[100px] border px-[8px] py-[3px] body-12 font-medium ${
        isRisk
          ? 'border-[rgba(229,34,34,0.50)] bg-[rgba(229,34,34,0.10)] text-status-negative'
          : 'border-[rgba(66,158,0,0.50)] bg-[rgba(66,158,0,0.10)] text-[#429E00]'
      }`}
    >
      {isRisk ? tNotification('typeRisk') : tNotification('typeScheduleChange')}
    </span>
  );
}
