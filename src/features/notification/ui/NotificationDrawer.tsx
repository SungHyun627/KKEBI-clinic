'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getNotifications } from '@/features/notification/api/getNotifications';
import type {
  NotificationItem as NotificationItemType,
  RiskNotification,
  NotificationViewMode,
} from '@/features/notification/types/notification';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from '@/shared/ui/drawer';
import NotificationItem from './NotificationItem';
import RiskNotificationItem from './RiskNotificationItem';

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<NotificationItemType[]>([]);
  const [viewMode, setViewMode] = useState<NotificationViewMode>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const loadNotifications = async () => {
      setIsLoading(true);
      const result = await getNotifications();

      if (!result.success || !result.data) {
        setNotifications([]);
        setViewMode('all');
        setErrorMessage(result.message || '알림 목록을 불러오지 못했습니다.');
        setIsLoading(false);
        return;
      }

      setNotifications(result.data.items);
      setViewMode(result.data.viewMode);
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadNotifications();
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={`flex flex-col items-start gap-[26px] px-[20px] pb-0 pt-[23px] ${
          viewMode === 'risk' ? 'bg-fill-pressed' : 'bg-neutral-99'
        }`}
      >
        <DrawerClose asChild>
          <button
            type="button"
            aria-label="접기"
            className="flex h-6 w-6 items-center justify-center hover:cursor-pointer"
          >
            <Image src="/icons/fold.svg" alt="접기" width={20} height={20} />
          </button>
        </DrawerClose>
        <div className="flex h-full w-full flex-col items-start gap-4">
          <div className="w-full">
            <DrawerTitle>{viewMode === 'risk' ? '위험 알림' : '알림'}</DrawerTitle>
          </div>

          <div className="relative flex flex-col counselor-inquiry-scroll flex-1 w-full overflow-y-auto gap-4">
            {isLoading ? (
              <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="body-16 text-label-alternative">알림을 불러오는 중입니다.</p>
              </div>
            ) : null}
            {!isLoading && errorMessage ? (
              <p className="body-16 text-status-negative">{errorMessage}</p>
            ) : null}
            {!isLoading && !errorMessage && notifications.length === 0 ? (
              <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="body-16 text-label-alternative">최근 온 알림이 없습니다.</p>
              </div>
            ) : null}

            {!isLoading &&
              !errorMessage &&
              viewMode === 'risk' &&
              notifications
                .filter(
                  (notification): notification is RiskNotification => notification.type === 'risk',
                )
                .map((notification) => (
                  <RiskNotificationItem
                    key={notification.id}
                    notification={notification}
                    onImmediateCheck={() => onOpenChange(false)}
                  />
                ))}

            {!isLoading &&
              !errorMessage &&
              viewMode === 'all' &&
              notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
