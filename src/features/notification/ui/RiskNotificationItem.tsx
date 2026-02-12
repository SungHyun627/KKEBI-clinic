import type { RiskNotification } from '@/features/notification/types/notification';

interface RiskNotificationItemProps {
  notification: RiskNotification;
  onClick: () => void;
}

export default function RiskNotificationItem({ notification, onClick }: RiskNotificationItemProps) {
  return (
    <button
      type="button"
      className="w-full rounded-xl border border-status-negative/20 bg-status-negative/5 px-4 py-3 text-left hover:cursor-pointer"
      onClick={onClick}
    >
      <p className="body-14 font-semibold text-status-negative">위험 알림 · {notification.name}</p>
      <p className="mt-1 body-14 text-label-normal">{notification.description}</p>
      <p className="mt-2 body-12 text-label-alternative">{notification.createdAt}</p>
    </button>
  );
}
