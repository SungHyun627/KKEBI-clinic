'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markNotificationAsRead,
} from '@/features/notification/api/getNotifications';
import { subscribeNotificationReceived } from '@/features/notification/lib/notification-events';
import { buildMockNotifications } from '@/features/notification/lib/mock-notifications';
import type {
  NotificationItem as NotificationItemType,
  NotificationListResponse,
} from '@/features/notification/types/notification';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from '@/shared/ui/drawer';
import NotificationItem from './NotificationItem';

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnreadCountSync?: (count: number) => void;
  onReadNotification?: () => void;
}

const NOTIFICATIONS_QUERY_KEY = ['notifications', 'list'] as const;

export default function NotificationDrawer({
  open,
  onOpenChange,
  onUnreadCountSync,
  onReadNotification,
}: NotificationDrawerProps) {
  const tNav = useTranslations('nav');
  const tNotification = useTranslations('notification');
  const queryClient = useQueryClient();
  const { data: notificationResult, isLoading } = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: getNotifications,
    enabled: open,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const errorMessage =
    notificationResult && (!notificationResult.success || !notificationResult.data)
      ? notificationResult.message || tNotification('commonLoadFailed')
      : null;
  const notifications = useMemo(() => {
    if (!notificationResult?.success || !notificationResult.data) return [];
    return notificationResult.data.length > 0 ? notificationResult.data : buildMockNotifications();
  }, [notificationResult]);

  useEffect(() => {
    onUnreadCountSync?.(notifications.filter((item) => !item.isRead).length);
  }, [notifications, onUnreadCountSync]);

  useEffect(() => {
    const unsubscribe = subscribeNotificationReceived((notification) => {
      queryClient.setQueryData<NotificationListResponse>(NOTIFICATIONS_QUERY_KEY, (prev) => {
        const currentItems = prev?.success && prev.data ? prev.data : [];
        const hasExisting = currentItems.some((item) => item.id === notification.id);
        const nextItems = hasExisting
          ? currentItems.map((item) => (item.id === notification.id ? notification : item))
          : [notification, ...currentItems];

        return {
          success: true,
          data: nextItems,
          message: prev?.message,
        };
      });
    });

    return unsubscribe;
  }, [queryClient]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const handleNotificationClick = async (notification: NotificationItemType) => {
    if (notification.isRead) return;

    const result = await markNotificationAsRead(notification.id);
    if (!result.success) return;

    queryClient.setQueryData<NotificationListResponse>(NOTIFICATIONS_QUERY_KEY, (prev) => {
      const currentItems = prev?.success && prev.data ? prev.data : [];
      return {
        success: true,
        data: currentItems.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
        message: prev?.message,
      };
    });
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
              <p className="body-16 text-black">{errorMessage}</p>
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
