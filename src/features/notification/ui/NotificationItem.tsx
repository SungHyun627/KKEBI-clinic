import type { NotificationItem as NotificationItemType } from '@/features/notification/types/notification';

interface NotificationItemProps {
  notification: NotificationItemType;
  onClick: () => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <button
      type="button"
      className="w-full rounded-xl border px-4 py-3 text-left hover:cursor-pointer"
      onClick={onClick}
    >
      {notification.type === 'risk' ? (
        <div className="rounded-lg border border-status-negative/20 bg-status-negative/5 p-3">
          <p className="body-14 font-semibold text-status-negative">
            위험 알림 · {notification.name}
          </p>
          <p className="mt-1 body-14 text-label-normal">{notification.description}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-95 bg-neutral-99 p-3">
          <p className="body-14 font-medium text-label-normal">{notification.title}</p>
          <p className="mt-1 body-14 text-neutral-40">{notification.description}</p>
        </div>
      )}
      <p className="mt-2 body-12 text-label-alternative">{notification.createdAt}</p>
    </button>
  );
}
