'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  getNotifications,
  markNotificationAsRead,
} from '@/features/notification/api/getNotifications';
import { subscribeNotificationReceived } from '@/features/notification/lib/notification-events';
import { buildMockNotifications } from '@/features/notification/lib/mock-notifications';
import type { NotificationItem as NotificationItemType } from '@/features/notification/types/notification';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from '@/shared/ui/drawer';
import NotificationItem from './NotificationItem';

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnreadCountSync?: (count: number) => void;
  onReadNotification?: () => void;
}

export default function NotificationDrawer({
  open,
  onOpenChange,
  onUnreadCountSync,
  onReadNotification,
}: NotificationDrawerProps) {
  const tNav = useTranslations('nav');
  const tNotification = useTranslations('notification');
  const [notifications, setNotifications] = useState<NotificationItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const loadNotifications = async () => {
      setIsLoading(true);
      const result = await getNotifications();

      if (!result.success || !result.data) {
        setNotifications([]);
        setErrorMessage(result.message || tNotification('commonLoadFailed'));
        setIsLoading(false);
        return;
      }

      const nextItems = result.data.length > 0 ? result.data : buildMockNotifications();
      setNotifications(nextItems);
      onUnreadCountSync?.(nextItems.filter((item) => !item.isRead).length);
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadNotifications();
  }, [onUnreadCountSync, open, tNotification]);

  useEffect(() => {
    const unsubscribe = subscribeNotificationReceived((notification) => {
      setNotifications((prev) => {
        const hasExisting = prev.some((item) => item.id === notification.id);
        const next = hasExisting
          ? prev.map((item) => (item.id === notification.id ? notification : item))
          : [notification, ...prev];
        onUnreadCountSync?.(next.filter((item) => !item.isRead).length);
        return next;
      });
    });

    return unsubscribe;
  }, [onUnreadCountSync]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const handleNotificationClick = async (notification: NotificationItemType) => {
    if (notification.isRead) return;

    const result = await markNotificationAsRead(notification.id);
    if (!result.success) return;

    setNotifications((prev) =>
      prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item)),
    );
    onReadNotification?.();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col items-start gap-[26px] bg-neutral-99 px-[20px] pb-0 pt-[23px]">
        <DrawerClose asChild>
          <button
            type="button"
            aria-label={tNotification('commonFold')}
            className="flex h-6 w-6 items-center justify-center hover:cursor-pointer"
          >
            <Image src="/icons/fold.svg" alt={tNotification('commonFold')} width={20} height={20} />
          </button>
        </DrawerClose>
        <div className="flex h-full w-full flex-col items-start gap-4">
          <div className="flex w-full items-center justify-between">
            <DrawerTitle>{tNav('notifications')}</DrawerTitle>
            <span className="body-14 text-label-alternative">
              {tNotification('unreadCount', { count: unreadCount })}
            </span>
          </div>

          <div className="hide-scrollbar relative flex w-full flex-1 flex-col gap-4 overflow-y-auto pb-12">
            {isLoading ? (
              <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="body-16 text-label-alternative">{tNotification('commonLoading')}</p>
              </div>
            ) : null}
            {!isLoading && errorMessage ? (
              <p className="body-16 text-status-negative">{errorMessage}</p>
            ) : null}
            {!isLoading && !errorMessage && notifications.length === 0 ? (
              <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="body-16 text-label-alternative">{tNotification('commonEmpty')}</p>
              </div>
            ) : null}

            {!isLoading &&
              !errorMessage &&
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                />
              ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
