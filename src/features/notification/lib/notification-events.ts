import type { NotificationItem } from '../types/notification';

const NOTIFICATION_RECEIVED_EVENT = 'kkebi-notification-received';

const isClient = () => typeof window !== 'undefined';

export const emitNotificationReceived = (notification: NotificationItem) => {
  if (!isClient()) return;
  window.dispatchEvent(
    new CustomEvent<NotificationItem>(NOTIFICATION_RECEIVED_EVENT, {
      detail: notification,
    }),
  );
};

export const subscribeNotificationReceived = (
  listener: (notification: NotificationItem) => void,
) => {
  if (!isClient()) return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<NotificationItem>;
    if (!customEvent.detail) return;
    listener(customEvent.detail);
  };

  window.addEventListener(NOTIFICATION_RECEIVED_EVENT, handler as EventListener);
  return () => {
    window.removeEventListener(NOTIFICATION_RECEIVED_EVENT, handler as EventListener);
  };
};
