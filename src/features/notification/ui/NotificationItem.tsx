import type { NotificationItem as NotificationItemType } from '@/features/notification/types/notification';
import NotificationTypeChip from './NotificationTypeChip';

interface NotificationItemProps {
  notification: NotificationItemType;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div className="flex w-full flex-col items-start gap-[18px] rounded-2xl bg-white p-5 text-left">
      <div className="flex w-full items-center justify-between">
        <NotificationTypeChip type={notification.type} />
        <span className="body-14 text-label-alternative align-center">
          {notification.createdAt}
        </span>
      </div>
      <div className="body-14 text-label-normal">{notification.description}</div>
    </div>
  );
}
